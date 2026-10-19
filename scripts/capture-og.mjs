// 部品ごとの共有画像の材料（見本の画像）を撮る。先に npm run build をして、out/ を配信しておく
//   python3 -m http.server 4334 --directory out & node scripts/capture-og.mjs
// 撮った見本は scripts/og-src/<id>.png（gitignore）。続けて python3 scripts/build-og.py で public/og/<id>.png を作る
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { PARTS } from "../src/lib/parts.ts";

const base = process.env.OG_BASE ?? "http://localhost:4334";
const dir = new URL("./og-src/", import.meta.url).pathname;
mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2 });
for (const p of PARTS) {
  await pg.goto(`${base}/parts/${p.id}/`);
  // 見本の周りの地・枠・切り抜きを外し、影まで含めて透明な地で撮る。震える動き（触覚フィードバック）は止める
  await pg.addStyleTag({
    content: `.k-replay{display:none!important} html,body,.side,.drawer-body,.entry-preview{background:transparent!important;background-image:none!important}
      .entry-preview{border:0!important;overflow:visible!important} .side{overflow:visible!important} .ph-buzz{animation:none!important}
      body *{visibility:hidden} .side .entry-preview, .side .entry-preview *{visibility:visible} .side{border:0!important;box-shadow:none!important}
      .side .entry-preview [style*="visibility:hidden"], .side .entry-preview [style*="visibility:hidden"] *{visibility:hidden!important}`,
  });
  // 出てくる動きが終わるまで待つ（トーストは2秒ほどで消えるので、それより前に撮る）
  await pg.waitForTimeout(p.id === "toast" ? 700 : 1100);
  const r = await pg.locator(".side .entry-preview > *").first().boundingBox();
  const pad = 24;
  await pg.screenshot({ path: `${dir}${p.id}.png`, omitBackground: true, clip: { x: r.x - pad, y: r.y - pad, width: r.width + pad * 2, height: r.height + pad * 2 } });
}
await b.close();
console.log(`撮影: ${PARTS.length} 件`);
