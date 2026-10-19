# アプリ部品図鑑 — 作業の案内

姉妹サイト「UI部品図鑑」（~/work/ai-component、Webの画面の部品）を複製して、色と中身をスマホアプリの部品に替えたサイト（2026-10-19 作成）。画面の作り（目次・図面・説明の列・吹き出し・部品ごとのページ）は UI部品図鑑と同じ。UI部品図鑑の AGENTS.md に書いた画面の決まり（部品名は1か所、スマホ幅は吹き出し、説明は「戻る」で閉じる等）はこちらにも当てはまる。片方の画面の作りを直したら、もう片方にも同じ直しが要るかを確かめる。

## 必読（作業の条件に当てはまるときだけ読む）

- 部品・頼み方の例・見分け方を足す／直す: `README.md` の「開発」と `src/lib/parts.ts` の先頭コメント
- 見た目を変える: `/Users/mashihara/.codex/guidelines/ui-visual-design.md`

## 続けて守ること

- サイトの目的は「アプリの部品の正式な名前を知り、名前でAIに頼めるようにする」こと。見た目の調整機能（つまみ）は付けない
- デザインは UI部品図鑑と同じ「白い方眼紙にインクで描いた設計図」で、インクの色だけ深緑（`--bp: #13795b`）。UI部品図鑑は青インク。黄は蛍光ペンとして地に敷くだけ、選んだ部品は山吹の角の印。地は冷たい白のまま、温かい色にしない
- 名前・意味・頼み方の例の正本は `src/lib/parts.ts`。見本（`previews.tsx`）の中身と頼み方の例をそろえる。名前は iOS（HIG）と Android（Material）で現場で使う呼び方にし、もう一方の呼び方は aka に入れる。造語や直訳をしない。似た名前は `CONFUSIONS` に見分け方を足す
- 見本はすべて小さなスマホ（`Phone`）の中に描く。画面の骨組みの部品は、見本の中のその部品を山吹の破線（`.ph-hl`）で指す
- 図面（`ScreenMap.tsx`）はスマホ1台。引き出し線の名前は上から順に、詰まっていない側へ振り分ける（縦に部品が多いので、左右の片側に寄せると縦にあふれる）。浮かせる部品（FAB・スナックバー・ホームインジケーター等）の位置は `.spot.クラス名` の2クラスで書き、e2e の overlap で重なりを検査する
- 姉妹サイトとの相互リンク: 上の帯の「Web／アプリ」の切り替え、トップの入口、各ページのフッター、部品の説明（`parts.ts` の `web` に UI部品図鑑の id を書いた部品だけ）。UI部品図鑑の id と名前は `src/lib/sister.ts`（正本は UI部品図鑑の parts.ts）。UI部品図鑑の側にも、こちらへの同じ導線がある。片方で部品の id を変えたら、もう片方のリンクも直す
- 公開URLは mashiharalab.dev/app-parts-zukan/（配信の実体は GitHub Pages、ましはらラボの `next.config.ts` が中継）。canonical・サイトマップは `SITE_URL`（CI の環境変数）で絶対URLにする
- 見た目を変えたら共有画像（`src/app/opengraph-image.png`、1200×630）も今の見た目で作り直す
- 部品ごとの共有画像は `public/og/<id>.png`（部品のページの og:image・twitter:image）。部品を足した・名前や見本を変えたときは、`npm run build` → `out/` を配信（ポート4334）→ `node scripts/capture-og.mjs` → `python3 scripts/build-og.py` で作り直す。e2e が全部品の画像の有無を検査する
- トップのページは、サブパスで書き出すと Next.js が `app/favicon.ico` の指定を付けないので、`src/app/page.tsx` で `<link rel="icon">` を足している（無いとドメイン直下のましはらラボのアイコンが出る）
- 別の作業ツリーと同時に検査するときは `PW_PORT=4332 npx playwright test` のように番号を変える
- 変更後は `npm run build` → `npx playwright test`（全58語の見本・浮かせた部品の重なり・引き出し線の重なりとはみ出し・スマホ幅・姉妹サイトへのリンクも検査する）

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
