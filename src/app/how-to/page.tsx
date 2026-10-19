import type { Metadata } from "next";
import HowTo from "@/components/HowTo";
import { SITE_NAME, SITE_URL, jsonLd } from "@/lib/site";

const title = `アプリの部品の名前をAIに渡す3つの方法｜${SITE_NAME}`;
const description = "調べたUI部品の名前を、Claude・ChatGPT・Codex・Cursor などのAIに渡す方法。名前を入れて頼む、選んだ名前をまとめて渡す、名前の一覧（llms.txt）ごと読ませる。";
const url = `${SITE_URL}/how-to/`;
const images = [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: SITE_NAME }];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "article", siteName: SITE_NAME, locale: "ja_JP", images },
  twitter: { card: "summary_large_image", title, description, images },
};

export default function Page() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "AIへの渡し方", item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <HowTo />
    </>
  );
}
