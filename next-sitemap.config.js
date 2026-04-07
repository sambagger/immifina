/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://immifina.org",
  generateRobotsTxt: true,
  /** Single urlset sitemap; App Router path discovery often yields none without this. */
  generateIndexSitemap: false,
  outDir: "public",
  additionalPaths: async () => {
    const publicPaths = [
      "/",
      "/terms",
      "/privacy",
      "/login",
      "/register",
      "/forgot-password",
    ];
    return publicPaths.map((loc) => ({ loc }));
  },
};
