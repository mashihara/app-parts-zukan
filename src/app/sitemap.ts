import type { MetadataRoute } from "next";
import { PARTS } from "@/lib/parts";
import { SITE_URL, partPath } from "@/lib/site";

// 静的書き出しで sitemap.xml を作る（トップ・見分け方・AIへの渡し方・部品ごとのページ）
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, priority: 1 }, { url: `${SITE_URL}/confusions/`, priority: 0.8 }, { url: `${SITE_URL}/how-to/`, priority: 0.6 }, ...PARTS.map((p) => ({ url: `${SITE_URL}${partPath(p.id)}`, priority: 0.8 }))];
}
