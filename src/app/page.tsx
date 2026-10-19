import type { Metadata } from "next";
import Home from "@/components/Home";
import { SITE_NAME, SITE_URL, TOP_DESCRIPTION, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

export default function Page() {
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/`, description: TOP_DESCRIPTION, inLanguage: "ja" };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Home />
    </>
  );
}
