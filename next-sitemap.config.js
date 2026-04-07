/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://immifina.org",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  exclude: ["/icon.png"],
  /**
   * `localePrefix: "never"` — canonical URLs have no /en/... segment. The prerender
   * manifest lists paths as `/en/...`, `/es/...`, `/zh/...`; emit one URL per page
   * using default locale only, stripped to the public path.
   */
  transform: async (config, path) => {
    if (path === "/icon.png") return null;

    const m = path.match(/^\/(en|es|zh)(\/.*)?$/);
    if (m) {
      if (m[1] !== "en") return null;
      const rest = m[2];
      const loc = !rest || rest === "/" ? "/" : rest;
      return {
        loc,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  /**
   * App Router pages that are not in `prerender-manifest.json` still need explicit
   * entries. Omit auth-only surfaces (dashboard, chat, settings, onboarding).
   */
  additionalPaths: async () => {
    const publicPaths = [
      "/",
      "/terms",
      "/privacy",
      "/login",
      "/register",
      "/forgot-password",
      "/banking",
      "/benefits",
      "/credit",
      "/forecast",
      "/paycheck",
      "/remittance",
      "/resources",
    ];
    return publicPaths.map((loc) => ({ loc }));
  },
};
