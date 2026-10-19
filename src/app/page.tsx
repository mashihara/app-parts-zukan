import type { Metadata } from "next";
import Home from "@/components/Home";
import { BASE_PATH, SITE_NAME, SITE_URL, TOP_DESCRIPTION, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

export default function Page() {
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, description: TOP_DESCRIPTION, inLanguage: "ja" };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      {/* サブパスで書き出すと、トップだけ app/favicon.ico の指定が付かない（Next.js 16.4）。
          付かないとブラウザがドメイン直下の /favicon.ico（ましはらラボのアイコン）を使うので、ここで足す（head へ移る） */}
      <link rel="icon" href={`${BASE_PATH}/favicon.ico`} sizes="48x48" type="image/x-icon" />
      <Home />
    </>
  );
}
