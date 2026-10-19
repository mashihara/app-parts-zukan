// AIに渡す文を組み立てる。目的は「部品を正式な名前で呼び合えるようにする」こと。
import { PART_MAP, shortEn } from "./parts.ts";

export const SITE_NAME = "アプリ部品図鑑";

export function buildPrompt(picks: string[], link: string): string {
  const out: string[] = [];
  out.push(`${SITE_NAME}で調べたアプリの部品の名前です。スマホアプリの画面を作る・直すときは、これらの部品をこの名前の意味どおりに使ってください。`);
  out.push("");
  picks.forEach((id, i) => {
    const p = PART_MAP[id];
    if (!p) return;
    out.push(`${i + 1}. ${p.ja}（${shortEn(p)}）: ${p.meaning}`);
    out.push(`   使いどころ: ${p.when}`);
    out.push(`   頼み方の例: ${p.ask}`);
  });
  out.push("");
  out.push("（ここに、作りたい物や直したい所を書いてください）");
  if (link) {
    out.push("");
    out.push(`名前の一覧と見本: ${link}`);
  }
  return out.join("\n");
}
