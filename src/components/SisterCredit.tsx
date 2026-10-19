import { SISTER } from "@/lib/sister";

// フッターの姉妹サイトの案内（UI部品図鑑にも、こちらを指す同じ案内がある）
export default function SisterCredit() {
  return (
    <p className="sister-credit">
      姉妹サイト：<a href={SISTER.url}>{SISTER.name}</a>（{SISTER.what}の名前。{SISTER.examples}）
    </p>
  );
}
