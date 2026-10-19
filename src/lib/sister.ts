// 姉妹サイト。アプリ部品図鑑（スマホアプリの部品）と UI部品図鑑（Webの画面の部品）は、同じ形の図鑑として互いにリンクする。
// UI部品図鑑のリポジトリは ~/work/ai-component（mashihara/ui-parts-zukan）。部品の id と名前はそちらの src/lib/parts.ts が正本
export const SISTER = {
  name: "UI部品図鑑",
  url: "https://mashiharalab.dev/ui-parts-zukan/",
  what: "Webの画面の部品",
  examples: "ヘッダー・モーダル・ダイアログ・ラジオボタンなど",
};

export const sisterPart = (id: string) => `${SISTER.url}parts/${id}/`;

// parts.ts の web に書いた id の、UI部品図鑑での名前
export const SISTER_NAMES: Record<string, string> = {
  header: "ヘッダー",
  "bottom-nav": "ボトムナビ",
  modal: "モーダル",
  dialog: "ダイアログ",
  drawer: "ドロワー",
  "bottom-sheet": "ボトムシート",
  toast: "トースト",
  "dropdown-menu": "ドロップダウンメニュー",
  button: "ボタン",
  fab: "FAB",
  "text-field": "テキストフィールド",
  select: "セレクトボックス",
  search: "検索バー",
  toggle: "トグルスイッチ",
  slider: "スライダー",
  segmented: "セグメントコントロール",
  "date-picker": "日付ピッカー",
  card: "カード",
  list: "リスト",
  avatar: "アバター",
  carousel: "カルーセル",
  badge: "バッジ",
  chip: "チップ",
  progress: "プログレスバー",
  spinner: "スピナー",
  skeleton: "スケルトン",
  empty: "エンプティステート",
};
