import type { MetadataRoute } from "next";
import { BASE_PATH, SITE_NAME, TOP_DESCRIPTION } from "@/lib/site";

// ホーム画面に追加したときの名前・アイコン・色。アイコンは public/icon-192.png・icon-512.png（icon.svg と同じ図柄）
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: TOP_DESCRIPTION,
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#f6faf8",
    theme_color: "#13795b",
    lang: "ja",
    icons: [
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
