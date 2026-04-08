const rateStore = new Map();

export function rateLimit(identifier, config) {
  const now = Date.now();
  const existing = rateStore.get(identifier);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + config.windowMs;
    rateStore.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (existing.count >= config.maxRequests) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetAt: existing.resetAt,
  };
}

export const RATE_LIMITS = {
  auth:     { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  chat:     { windowMs: 60 * 1000,      maxRequests: 10 },
  forecast: { windowMs: 60 * 1000,      maxRequests: 20 },
  api:      { windowMs: 60 * 1000,      maxRequests: 100 },
  waitlist: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
};
