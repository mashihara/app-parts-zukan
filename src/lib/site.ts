// サイトの名前・公開URL・ページの題。メタデータ（サーバー）と画面（クライアント）の両方で使う
import { CATEGORIES, PART_MAP, shortEn, type Part } from "./parts.ts";
import { SITE_NAME } from "./prompt.ts";

export { SITE_NAME };
// サブパス（GitHub Pages では /app-parts-zukan）。画面の中のリンクと URL の書き換えに使う
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// 公開URL（サブパスまで含む）。canonical・サイトマップ・構造化データの絶対URLに使う
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:4320").replace(/\/$/, "");

export const TOP_TITLE = `${SITE_NAME} — そのアプリの部品、なんて呼ぶ？スマホアプリの部品の名前が分かる図面`;
export const TOP_DESCRIPTION =
  "タブバー・ボトムシート・スナックバー・スワイプアクションなど、スマホアプリの部品の正式な名前を図面から調べ、意味・使いどころ・AIへの頼み方が分かるサイト。";

// 部品のページのパス（サブパスを除く）
export const partPath = (id: string) => `/parts/${id}/`;
export const partTitle = (p: Part) => `${p.ja}（${shortEn(p)}）とは？意味とAIへの頼み方｜${SITE_NAME}`;
export const partDescription = (p: Part) => `${p.ja}（${p.en}）は「${p.meaning}」アプリの部品です。${p.when}AIへの頼み方の例と、見分けにくい名前との違いも載せています。`;
export const catLabel = (id: string) => CATEGORIES.find((c) => c.id === PART_MAP[id]?.cat)?.label ?? "";

// 構造化データを <script> に埋め込む文字列（</script> で閉じられないよう < を逃がす）
export const jsonLd = (x: unknown) => JSON.stringify(x).replace(/</g, "\\u003c");
