import type { Metadata } from "next";
import "./globals.css";
import "../components/kit.css";
import "../components/app-kit.css";
import { SITE_NAME, SITE_URL, TOP_DESCRIPTION, TOP_TITLE } from "@/lib/site";

// 共有画像の絶対URLの土台（ドメインだけ。サブパスは next.config の basePath から Next.js が足す）
const SITE = process.env.NEXT_PUBLIC_SITE_URL;
// 正規の公開先（ましはらラボのドメイン）。GitHub Pages（*.github.io）で直接開かれたら、こちらの同じページへ移す。
// 配信の実体は GitHub Pages のままで、mashiharalab.dev/app-parts-zukan/ から中継している（検索の評価を本体のドメインにまとめるため）
const CANONICAL_ORIGIN = new URL(SITE_URL).origin;
const MOVE_TO_CANONICAL = `if(location.hostname.endsWith(".github.io")&&location.origin!==${JSON.stringify(CANONICAL_ORIGIN)})location.replace(${JSON.stringify(CANONICAL_ORIGIN)}+location.pathname+location.search+location.hash)`;
// 閲覧数の計測。ましはらラボ（Vercel）の Web Analytics を、中継先のドメインで開かれたときだけ読む。
// スクリプトは mashiharalab.dev の直下（/_vercel/insights/）にあり、github.io や手元（http）では 404 になるため読まない
const ANALYTICS = `if(location.protocol==="https:"&&location.origin===${JSON.stringify(CANONICAL_ORIGIN)}){window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};var s=document.createElement("script");s.defer=true;s.src="/_vercel/insights/script.js";document.head.appendChild(s)}`;

export const metadata: Metadata = {
  title: TOP_TITLE,
  description: TOP_DESCRIPTION,
  ...(SITE ? { metadataBase: new URL(SITE) } : {}),
  openGraph: {
    title: SITE_NAME, description: "そのアプリの部品、なんて呼ぶ？スマホの画面に図面のように名前を書き込んだ、アプリの部品の名前の辞書。",
    type: "website", siteName: SITE_NAME, locale: "ja_JP", url: `${SITE_URL}/`,
  },
  twitter: { card: "summary_large_image" },
  // canonical は各ページで書く（ここに書くと全ページに継承され、部品のページもトップを指してしまう）
  alternates: { types: { "text/plain": `${SITE_URL}/llms.txt` } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOVE_TO_CANONICAL }} />
        <script dangerouslySetInnerHTML={{ __html: ANALYTICS }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans+JP:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
