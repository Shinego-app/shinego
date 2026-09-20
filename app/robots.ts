import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/betalingen/",
        "/boeken/",
        "/professional/dashboard/",
        "/professional/login/",
        "/professional/bevestigd/",
        "/professional/wachtwoord-vergeten/",
        "/professional/wachtwoord-resetten/",
      ],
    },
    sitemap: "https://www.shinego.nl/sitemap.xml",
    host: "https://www.shinego.nl",
  };
}
