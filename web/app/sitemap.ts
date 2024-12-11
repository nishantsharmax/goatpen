import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://my.ine.com",
      lastModified: new Date(),
    },
  ];
}
