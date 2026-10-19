# アプリ部品図鑑

https://mashiharalab.dev/app-parts-zukan/

**そのアプリの部品、なんて呼ぶ？** スマホアプリ（iOS・Android）の部品の正式な名前が分かる、図面の形をした辞書です。

- 「下から出てくるやつ」「横にずらすと出るボタン」ではAIに伝わりません。見本のスマホの画面に図面の引き出し線で名前を書き込みました。タブバー・ボトムシート・スナックバー・スワイプアクション・プルして更新・ダイナミックアイランドなど、58個の名前が分かります。
- 名前を押すと、意味・使いどころ・動く見本・そのまま使える「AIへの頼み方の例」が出ます。
- アラートとアクションシート、スナックバーとトーストなど、取り違えやすい名前の見分け方も載せています。
- 選んだ名前は、意味と頼み方の例が入った文にしてAIへ渡せます。

Webの画面の部品（ヘッダー・モーダル・ダイアログなど）は、姉妹サイトの [UI部品図鑑](https://mashiharalab.dev/ui-parts-zukan/)（リポジトリ mashihara/ui-parts-zukan）で調べられます。2つの図鑑は同じ形で、上の帯の「Web／アプリ」の切り替えで行き来できます。

## AIに読ませる

| 物 | 中身 |
|---|---|
| `/llms.txt` | サイトの説明・全部品の名前・まぎらわしい名前 |
| `/api/v1/catalog.json` | 同じ内容の機械向けデータ |
| `/api/v1/parts/<id>.txt` | 部品ごとの説明と頼み方の例 |
| `skills/app-parts-zukan/SKILL.md` | Claude Code・Codex 用のスキル（`npx skills add mashihara/app-parts-zukan`） |

リンクの形: `?pick=bottom-sheet,snackbar&part=bottom-sheet`（pick＝選んだ部品、part＝開く部品）

## 開発

Node 22.18 以上（`.node-version` は 24.20.0）。

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ に静的書き出し（llms.txt と api/ も生成）
npx playwright test
```

- 名前・意味・頼み方の例の正本は `src/lib/parts.ts`。見本は `src/components/previews.tsx` と `app-kit.css`、図面は `ScreenMap.tsx`。
- サブパスで公開するときは `NEXT_PUBLIC_BASE_PATH=/app-parts-zukan`、`llms.txt` に絶対URLを書くときは `SITE_URL=https://…` を付けてビルドする。
- 配信は GitHub Pages。公開URLの mashiharalab.dev/app-parts-zukan/ は、ましはらラボ（~/work/mashiharalab）の `next.config.ts` が中継している。

## ライセンス

MIT
