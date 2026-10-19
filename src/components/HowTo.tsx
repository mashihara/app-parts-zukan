// AIへの渡し方（/how-to/）。調べた名前を AI に渡す3つの方法を、例と一緒に並べる
import SiteHeader from "./SiteHeader";
import { PARTS } from "@/lib/parts";
import { BASE_PATH, SITE_NAME, SITE_URL } from "@/lib/site";
import LabCredit from "./LabCredit";
import SisterCredit from "./SisterCredit";

export default function HowTo() {
  return (
    <div className="site">
      <SiteHeader current="how-to" />
      <section className="intro is-part confuse-intro">
        <nav className="crumbs" aria-label="現在地">
          <a href={`${BASE_PATH}/`}>{SITE_NAME}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">AIへの渡し方</span>
        </nav>
        <h1>AIへの渡し方</h1>
        <p className="intro-meaning">調べた部品の名前を、AIに渡す3つの方法</p>
        <p className="intro-when">Claude・ChatGPT・Codex・Cursor など、どのAIでも使えます。SwiftUI・Jetpack Compose・Flutter・React Native のどれで作るときも同じ名前で伝わります。上から順に手軽です。</p>
      </section>

      <ol className="how-list">
        <li className="how-row">
          <div className="confuse-text">
            <h2>名前を入れて頼む</h2>
            <p>いちばん簡単な使い方です。調べた名前を、いつもの頼みごとに入れるだけで伝わり方が変わります。各部品のページにある「AIへの頼み方の例」をそのまま使えます。</p>
            <a className="how-go" href={`${BASE_PATH}/#names`}>部品の名前を調べる →</a>
          </div>
          <pre>下から出てくるやつで絞り込みを出して{"\n"}↓{"\n"}「絞り込み」を押したらボトムシートを画面の半分まで出して。上に取っ手を付けて、下へスワイプで閉じられるように。</pre>
        </li>
        <li className="how-row">
          <div className="confuse-text">
            <h2>選んだ名前をまとめて渡す</h2>
            <p>使いたい部品を、説明の「AIに渡す名前に入れる」で選び、下の帯の「AIに渡す文を見る」からコピーします。名前・意味・頼み方の例がまとめて入るので、そのまま貼れます。</p>
            <a className="how-go" href={`${BASE_PATH}/`}>図面から部品を選ぶ →</a>
          </div>
          <pre>1. ボトムシート（Bottom sheet）: 画面の下から途中まで…{"\n"}2. スナックバー（Snackbar）: 下に出て数秒で消える…{"\n"}{"\n"}（ここに、作りたい物や直したい所を書いてください）</pre>
        </li>
        <li className="how-row">
          <div className="confuse-text">
            <h2>名前の一覧ごと読ませる</h2>
            <p>
              <a href={`${BASE_PATH}/llms.txt`}>llms.txt</a> と <a href={`${BASE_PATH}/api/v1/catalog.json`}>catalog.json</a> に、{PARTS.length}個の名前・意味・頼み方の例をまとめています。AIに読ませれば、名前で話せるようになります。Claude Code・Codex には、スキルとして入れることもできます。
            </p>
          </div>
          <div className="how-pres">
            <pre>{SITE_URL}/llms.txt{"\n"}を読んで、この画面の部品を正しい名前で説明して。</pre>
            <pre>npx skills add mashihara/app-parts-zukan</pre>
          </div>
        </li>
      </ol>
      <footer className="credit">
        <p><a href={`${BASE_PATH}/`}>{SITE_NAME}のトップへ戻る</a></p>
        <SisterCredit />
        <LabCredit />
      </footer>
    </div>
  );
}
