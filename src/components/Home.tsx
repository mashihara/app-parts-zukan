import Dictionary from "@/components/Dictionary";
import SiteHeader from "@/components/SiteHeader";
import { CONFUSIONS } from "@/lib/parts";
import { BASE_PATH } from "@/lib/site";
import { SISTER } from "@/lib/sister";
import SisterCredit from "./SisterCredit";
import LabCredit from "@/components/LabCredit";

// トップと部品ごとのページで共通の中身。initialPart があれば、その部品を選んだ状態で書き出す
export default function Home({ initialPart }: { initialPart?: string }) {
  return (
    <div className="site">
      <SiteHeader />

      <Dictionary initialPart={initialPart}>
        {/* 見分け方（/confusions/）と AI への渡し方（/how-to/）は別ページ。ここには入口だけ置く */}
        <section className="info read-links" id="read">
          <a className="confuse-link" href={`${BASE_PATH}/confusions/`}>
            <span>
              <b>まぎらわしい名前の見分け方</b>
              <small>アラートとアクションシート、スナックバーとトーストなど、取り違えやすい名前{CONFUSIONS.length}組</small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a className="confuse-link" href={`${BASE_PATH}/how-to/`}>
            <span>
              <b>AIへの渡し方</b>
              <small>名前を入れて頼む・選んだ名前をまとめて渡す・名前の一覧ごと読ませる</small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          {/* 姉妹サイト。Webの画面の部品は UI部品図鑑で調べる */}
          <a className="confuse-link is-sister" href={SISTER.url}>
            <span>
              <b>{SISTER.what}は {SISTER.name} へ</b>
              <small>{SISTER.examples}、Webサイト・管理画面の部品の名前を同じ図面の形で調べられます</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <footer className="credit">
          <p>
            「名前を知っていれば、AIに頼める」という考え方は、大滝昇平さんの
            <a href="https://showheyohtaki.github.io/motion-prompt/" target="_blank" rel="noreferrer"> Motion Prompt </a>
            から学びました。動きの名前はそちらで調べられます。
          </p>
          <SisterCredit />
        <LabCredit />
        </footer>
      </Dictionary>

    </div>
  );
}
