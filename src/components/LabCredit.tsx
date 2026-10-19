// フッターの作り手の表記。図鑑は ましはらラボ（mashiharalab.dev）の下で配信しているので、本体へ戻れるようにする
export const LAB_URL = "https://mashiharalab.dev/";

export default function LabCredit() {
  return (
    <p className="lab-credit">
      作った人：<a href={LAB_URL}>ましはらラボ</a>（個人で作っているアプリ・サービスの一覧）
    </p>
  );
}
