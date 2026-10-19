// 部品ごとのページ（/parts/<id>/）。中身はトップと同じで、その部品を選んだ状態で書き出す。
// 検索で「〇〇とは」を拾えるよう、題・説明・h1・構造化データを部品ごとに持たせる
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/components/Home";
import { PARTS, PART_MAP, shortEn } from "@/lib/parts";
import { SITE_NAME, SITE_URL, catLabel, jsonLd, partDescription, partPath, partTitle } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return PARTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/parts/[id]">): Promise<Metadata> {
  const p = PART_MAP[(await params).id];
  if (!p) return {};
  const title = partTitle(p);
  const description = partDescription(p);
  const url = `${SITE_URL}${partPath(p.id)}`;
  // 子で openGraph を書くとルートの共有画像が付かなくなるので、画像も明示する
  const images = [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630, alt: SITE_NAME }];
  return {
    title,
    description,
    alternates: { canonical: url },
    // 子の openGraph は親を丸ごと置き換えるので、サイト名などもここで書き直す
    openGraph: { title, description, url, type: "article", siteName: SITE_NAME, locale: "ja_JP", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function PartPage({ params }: PageProps<"/parts/[id]">) {
  const { id } = await params;
  const p = PART_MAP[id];
  if (!p) notFound();
  const url = `${SITE_URL}${partPath(p.id)}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: p.ja,
      alternateName: [shortEn(p), ...(p.aka ?? [])],
      description: `${p.meaning}。${p.when}`,
      url,
      inDefinedTermSet: { "@type": "DefinedTermSet", name: SITE_NAME, url: `${SITE_URL}/` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: catLabel(p.id) },
        { "@type": "ListItem", position: 3, name: p.ja, item: url },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Home initialPart={p.id} />
    </>
  );
}
