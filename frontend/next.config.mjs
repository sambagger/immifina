import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keeps compiled pages in memory longer in dev — helps avoid stale chunk / HMR 404s after edits.
  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      maxInactiveAge: 120 * 1000,
      pagesBufferLength: 10,
    },
  }),
  async headers() {
    const security = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    if (process.env.NODE_ENV === "production") {
      security.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }
    return [{ source: "/:path*", headers: security }];
  },
  // next-intl → use-intl → intl-messageformat / @formatjs/* — transpile so server chunks stay consistent.
  transpilePackages: [
    "next-intl",
    "use-intl",
    "intl-messageformat",
    "@formatjs/intl-localematcher",
    "@formatjs/fast-memoize",
  ],
  // Keep default webpack caching in dev; disabling it caused frequent missing-chunk / HMR errors.
  // If you see stale chunks: stop dev, run `rm -rf .next`, restart `npm run dev`.
  webpack: (config) => {
    config.ignoreWarnings = [
      (warning) =>
        /PackFileCacheStrategy|Build dependencies behind this expression|import\(t\)/.test(
          String(warning.message ?? warning)
        ),
    ];
    return config;
  },
};

export default withNextIntl(nextConfig);
