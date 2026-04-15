import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { ChatMessageSchema } from "@/lib/validation";
import { getKnowledgeContext } from "@/lib/rag";
import { getWorkflow, getStepCount } from "@/lib/workflow-templates";
import { getUserMemories, formatMemoriesBlock, extractAndSaveMemories } from "@/lib/memory";
import { IMMIFINA_TOOLS, executeTool } from "@/lib/tools";

const MODEL = "claude-sonnet-4-20250514";

/** Prefer nested Anthropic `error.message` over the full stringified body. */
function anthropicUserVisibleMessage(err: unknown): string {
  if (err instanceof APIError && err.error && typeof err.error === "object") {
    const body = err.error as { error?: { message?: string }; message?: string };
    const nested = body.error?.message;
    if (typeof nested === "string" && nested.length > 0) return nested;
    if (typeof body.message === "string" && body.message.length > 0) return body.message;
  }
  return err instanceof Error ? err.message : String(err);
}

async function buildUserContext(userId: string): Promise<string> {
  if (!isSupabaseConfigured()) return "{}";
  const supabase = createServiceClient();

  const [userRes, profileRes, goalRes] = await Promise.all([
    supabase
      .from("users")
      .select("name, preferred_language, immigration_status")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("financial_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_goals")
      .select("goal_type, status, current_step")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const income = Number(profile?.monthly_income ?? 0);
  const expenses = Number(profile?.monthly_expenses ?? 0);
  const surplus = income - expenses;
  const savings = Number(profile?.current_savings ?? 0);

  // Include active goal context so Claude can give step-specific advice
  let activeGoal: Record<string, unknown> | null = null;
  if (goalRes.data) {
    const g = goalRes.data;
    const workflow = getWorkflow(g.goal_type);
    const totalSteps = getStepCount(g.goal_type);
    const currentStep = workflow?.steps[g.current_step];
    activeGoal = {
      type: g.goal_type,
      label: workflow?.label ?? g.goal_type,
      currentStepIndex: g.current_step,
      totalSteps,
      currentStepTitle: currentStep?.title ?? null,
      stepsCompleted: g.current_step,
    };
  }

  return JSON.stringify({
    user: userRes.data,
    profile,
    derived: {
      monthlySurplus: surplus,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      currentSavings: savings,
    },
    activeGoal,
  });
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit(`chat:${session.userId}`, RATE_LIMITS.chat);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ChatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const rawMessage = parsed.data.message;
  const message = sanitizeString(rawMessage);
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const supabase = createServiceClient();
  let conversationId = parsed.data.conversationId;

  const { data: userRow } = await supabase
    .from("users")
    .select("preferred_language")
    .eq("id", session.userId)
    .maybeSingle();
  const convLang =
    userRow?.preferred_language === "es" || userRow?.preferred_language === "zh"
      ? userRow.preferred_language
      : "en";

  if (!conversationId) {
    const { data: conv, error: cErr } = await supabase
      .from("conversations")
      .insert({
        user_id: session.userId,
        title: message.slice(0, 80),
        language: convLang,
      })
      .select("id")
      .single();

    if (cErr || !conv) {
      console.error(cErr);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    conversationId = conv.id;
  } else {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", session.userId)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  const { data: historyRows } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);

  // Fetch user context, RAG knowledge, and memories in parallel
  const [userContext, knowledgeContext, userMemories] = await Promise.all([
    buildUserContext(session.userId),
    getKnowledgeContext(message, { limit: 4, threshold: 0.68 }),
    getUserMemories(session.userId),
  ]);

  const memoriesBlock = formatMemoriesBlock(userMemories);

  const systemPrompt = `${knowledgeContext ? knowledgeContext + "\n\n" : ""}${memoriesBlock ? memoriesBlock + "\n\n" : ""}You are ImmiFina's financial guide — knowledgeable, patient, and culturally sensitive. You help immigrants and first-generation Americans understand the U.S. financial system.

Communication style:
- Plain language first; define any necessary jargon immediately.
- Acknowledge that U.S. systems are confusing and often not designed for newcomers — it is not the user's fault.
- Explain WHY something matters before WHAT to do; use concrete examples and round numbers when helpful.
- Give specific, actionable next steps, not vague tips. Use the user's profile context when relevant.
- Be encouraging; normalize not knowing these systems.
- Respond in the same language the user writes in.

You can help with: banking, credit and secured cards, budgeting, taxes and ITIN/SSN at a high level, remittances, benefits programs (educational overview), paychecks and forms, renting vs buying (educational).

You must NOT: recommend specific investments or securities; give immigration legal advice; tell users to sign or not sign legal documents; guarantee outcomes; diagnose complex tax situations (suggest VITA or a licensed CPA instead).

Additional guidance for specific topics:

When discussing credit products:
Always mention that you are not recommending any specific product. Frame as "some people in this situation explore..." Always mention the option of nonprofit credit counseling for free guidance.

When discussing tax topics:
Always recommend VITA (free IRS tax preparation assistance) as an option. Never calculate specific tax amounts users should pay or owe — only general educational estimates. Remind users that tax situations are complex and individual.

When discussing banking:
Note that policies change frequently and the user should always verify directly with any institution. Do not recommend specific banks or accounts.

When discussing benefits:
Always include the public charge education before benefits that may be subject to that rule. Always recommend consulting an immigration attorney or accredited representative if the user has an active immigration case.

When discussing predatory products:
Educate without alarmism. Explain what the product is and how costs are structured. Let the user draw their own conclusions. Do not tell them what to do.

Framing rules for all financial topics:
- Never say "you should" — say "some people consider" or "one approach is" or "it may be worth exploring"
- Never say "you must" — say "typically required" or "commonly asked for"
- Never guarantee outcomes — say "may" and "can" not "will" and "does"
- Always offer the option of free professional help (VITA, nonprofit credit counseling, immigration legal aid)

Always end substantive answers about personal financial decisions with this closing (translate if the user is not writing in English):
"This is educational guidance, not financial advice. For decisions specific to your situation, consider speaking with a financial counselor or advisor. Many community organizations offer free financial counseling."

User profile JSON (use numbers and flags to personalize; if a field is missing, say you do not have it). The "activeGoal" field shows the user's current guided journey — if they ask about their goal or current step, reference it:
${userContext}`;

  const history =
    historyRows?.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })) ?? [];

  const client = new Anthropic({ apiKey });

  let reply: string;
  try {
    // Build the message list — this grows as tools are called
    const messages: Anthropic.MessageParam[] = [
      ...history,
      { role: "user", content: message },
    ];

    let response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      tools: IMMIFINA_TOOLS,
      messages,
    });

    // Agentic loop: keep running until Claude stops calling tools
    let iterations = 0;
    while (response.stop_reason === "tool_use" && iterations < 5) {
      iterations++;

      // Add Claude's tool_use response to the message history
      messages.push({ role: "assistant", content: response.content });

      // Execute each tool Claude requested
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = await executeTool(
            block.name,
            block.input as Record<string, unknown>,
            { userId: session.userId }
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }

      // Feed results back to Claude
      messages.push({ role: "user", content: toolResults });

      response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        tools: IMMIFINA_TOOLS,
        messages,
      });
    }

    const block = response.content.find((b) => b.type === "text");
    reply = block && block.type === "text" ? block.text : "";
    if (!reply) {
      return NextResponse.json({ error: "Empty response" }, { status: 500 });
    }
  } catch (e) {
    console.error(e);
    let userMessage = anthropicUserVisibleMessage(e);
    if (userMessage.length > 800) {
      userMessage = `${userMessage.slice(0, 800)}…`;
    }

    if (/invalid_api_key|authentication|401/i.test(userMessage)) {
      userMessage =
        "Invalid or expired API key. In console.anthropic.com create a key under the same org where you added credits, then update CLAUDE_API_KEY in .env.local and restart the dev server.";
    } else if (/credit balance|too low|Plans & Billing|billing/i.test(userMessage)) {
      userMessage += `

If you already added credits: billing applies per organization. Open console.anthropic.com → Settings → API keys and confirm this key’s workspace matches **Plans & billing** where you paid. Create a **new API key** in that workspace, paste it into CLAUDE_API_KEY, restart \`npm run dev\`, and try again.`;
    }

    return NextResponse.json({ error: userMessage.trim() }, { status: 500 });
  }

  await supabase.from("messages").insert([
    { conversation_id: conversationId, role: "user", content: message },
    { conversation_id: conversationId, role: "assistant", content: reply },
  ]);

  // Fire-and-forget: extract memories from this exchange (non-blocking)
  void extractAndSaveMemories({
    userId: session.userId,
    conversationId: conversationId!,
    userMessage: message,
    assistantReply: reply,
    existingMemories: userMemories,
    apiKey,
  });

  return NextResponse.json({ reply, conversationId });
}
