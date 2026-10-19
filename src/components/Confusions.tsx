// まぎらわしい名前の見分け方（/confusions/）。組ごとに、見分け方の文と、該当する部品の小さな見本を並べる
import type { CSSProperties } from "react";
import SiteHeader from "./SiteHeader";
import { PartPreview } from "./previews";
import { CONFUSIONS, PART_MAP, shortEn } from "@/lib/parts";
import { BASE_PATH, SITE_NAME, partPath } from "@/lib/site";
import { DEFAULT_TOKENS, cssVars } from "@/lib/tokens";
import LabCredit from "./LabCredit";
import SisterCredit from "./SisterCredit";

const VARS = cssVars(DEFAULT_TOKENS) as CSSProperties;

export default function Confusions() {
  return (
    <div className="site">
      <SiteHeader current="confusions" />
      <section className="intro is-part confuse-intro">
        <nav className="crumbs" aria-label="現在地">
          <a href={`${BASE_PATH}/`}>{SITE_NAME}</a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">見分け方</span>
        </nav>
        <h1>まぎらわしい名前の見分け方</h1>
        <p className="intro-meaning">AIへの頼みごとで特に取り違えやすい名前、{CONFUSIONS.length}組</p>
        <p className="intro-when">名前を正しく書くだけで、出てくる画面がぐっと狙いに近づきます。部品を押すと、意味とAIへの頼み方が分かります。</p>
      </section>

      <ol className="confuse-list">
        {CONFUSIONS.map((c) => (
          <li key={c.title} className="confuse-row">
            <div className="confuse-text">
              <h2>{c.title}</h2>
              <p>{c.rule}</p>
            </div>
            <ul className="confuse-parts">
              {c.parts.map((id) => {
                const p = PART_MAP[id];
                return (
                  <li key={id}>
                    <a className="name-card" href={`${BASE_PATH}${partPath(id)}`}>
                      <span className="thumb kit" style={VARS} inert aria-hidden="true">
                        <span className="thumb-in"><PartPreview id={id} /></span>
                      </span>
                      <span className="nc-text">
                        <span className="nc-ja">{p.ja}</span>
                        <span className="nc-en">{shortEn(p)}</span>
                        <span className="nc-m">{p.meaning}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      <footer className="credit">
        <p><a href={`${BASE_PATH}/`}>{SITE_NAME}のトップへ戻る</a></p>
        <SisterCredit />
        <LabCredit />
      </footer>
    </div>
  );
}
