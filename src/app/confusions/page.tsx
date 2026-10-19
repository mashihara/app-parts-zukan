import type { Metadata } from "next";
import Confusions from "@/components/Confusions";
import { CONFUSIONS } from "@/lib/parts";
import { SITE_NAME, SITE_URL, jsonLd } from "@/lib/site";

const title = `まぎらわしいアプリの部品の名前の見分け方（${CONFUSIONS.length}組）｜${SITE_NAME}`;
const description = "アラートとアクションシート、スナックバーとトースト、タブバーとツールバーなど、AIへの頼みごとで取り違えやすいスマホアプリの部品の名前の見分け方。";
const url = `${SITE_URL}/confusions/`;
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
      { "@type": "ListItem", position: 2, name: "見分け方", item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Confusions />
    </>
  );
}
