"use client";
// 図面：見本のスマホの画面の部品に、図面の引き出し線で名前を書き込む。
// 広い幅では左右の余白に名前を並べて線でつなぐ。狭い幅では名前を書き込まず（札を重ねると見本の文字が隠れる）、
// 押した部品のそばに吹き出しで名前を出す。
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Icon from "./Icon";
import { Carousel, Cell, Chips, SearchBar, Segmented, SHOPS, StatusIcons } from "./previews";
import { PART_MAP, shortEn } from "@/lib/parts";
import { DEFAULT_TOKENS, cssVars } from "@/lib/tokens";

const VARS = cssVars(DEFAULT_TOKENS) as CSSProperties;

type Ctx = { hover: string | null; setHover: (id: string | null) => void; onPick: (id: string) => void; selected: string };
const MapCtx = createContext<Ctx | null>(null);

function Spot({ id, children, className = "", as = "div" }: { id: string; children: ReactNode; className?: string; as?: "div" | "span" }) {
  const c = useContext(MapCtx)!;
  const Tag = as;
  return (
    <Tag
      data-part={id}
      className={`spot ${className} ${c.hover === id ? "is-hover" : ""} ${c.selected === id ? "is-sel" : ""}`}
      onMouseOver={(e) => {
        e.stopPropagation();
        c.setHover(id);
      }}
      onMouseLeave={() => c.setHover(null)}
      onClickCapture={(e) => {
        // 部品そのものの操作より先に名前を選ぶ。入れ子のときは内側を優先
        if ((e.target as HTMLElement).closest(".spot") !== e.currentTarget) return;
        e.preventDefault();
        e.stopPropagation();
        c.onPick(id);
      }}
    >
      {children}
    </Tag>
  );
}

// 全体図に書き込んである部品。これ以外（重なって出る窓・指の動きなど）は、真ん中を単体の見本に切り替えて見せる
export const MAP_PARTS = new Set([
  "status-bar", "dynamic-island", "nav-bar", "back-button", "badge", "large-title", "search-bar", "segmented", "chip",
  "carousel", "card", "page-control", "section-header", "list-cell", "avatar", "disclosure", "swipe-action",
  "fab", "snackbar", "tab-bar", "home-indicator",
]);

type Callout = { id: string; side: "l" | "r"; ex: number; ey: number; y: number; w: number; cx: number; top: number; right: number; left: number };

const WIDE = 780; // これより広ければ引き出し線で書き込む
const GAP = 36; // 名前どうしの最小の縦の間隔

const BUBBLE_W = 280; // 吹き出しの幅

// onPick の inline は、狭い幅で図面から選んだとき（説明を重ねて開かず、吹き出しで名前を出す）
export default function ScreenMap({ onPick, selected, bubble }: { onPick: (id: string, inline: boolean) => void; selected: string; bubble?: ReactNode }) {
  const [hover, setHover] = useState<string | null>(null);
  const [tip, setTip] = useState<{ left: number; top: number; width: number; arrow: number; below: boolean } | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ wide: boolean; items: Callout[]; sl: number; sr: number; h: number }>({ wide: false, items: [], sl: 0, sr: 0, h: 0 });
  const wrap = useRef<HTMLDivElement>(null);

  // 部品の実際の位置を測って、引き出し線と名前の位置を決める
  const layout = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const W = el.getBoundingClientRect();
    const sheet = el.querySelector(".sheet")!.getBoundingClientRect();
    if (W.width < WIDE) {
      setLines((cur) => (cur.wide ? { wide: false, items: [], sl: 0, sr: 0, h: 0 } : cur));
      return;
    }
    const sl = sheet.left - W.left;
    const sr = sheet.right - W.left;
    const mid = (sl + sr) / 2;
    const all: Callout[] = [];
    el.querySelectorAll<HTMLElement>("[data-part]").forEach((node) => {
      const r = node.getBoundingClientRect();
      if (!r.width || !r.height) return;
      all.push({
        id: node.dataset.part!, side: "l", ex: 0, ey: r.top - W.top + Math.min(r.height / 2, 16), y: 0,
        w: r.width, cx: r.left - W.left + r.width / 2, top: r.top - W.top, left: r.left - W.left - 3, right: r.right - W.left + 3,
      });
    });
    // スマホの画面は縦に部品が多いので、上から順に、名前が詰まっていない側へ振り分ける。
    // 横に狭い部品は近い側（左半分なら左）に置き、横に広い部品は空いている側に置く
    all.sort((a, b) => a.ey - b.ey);
    const last = { l: -Infinity, r: -Infinity };
    for (const c of all) {
      const near: "l" | "r" | null = c.w > sheet.width * 0.6 ? null : c.cx < mid ? "l" : "r";
      const side = near ?? (last.l <= last.r ? "l" : "r");
      c.side = side;
      c.ex = side === "l" ? c.left : c.right;
      c.y = Math.max(c.ey, last[side] + GAP);
      last[side] = c.y;
    }
    setLines({ wide: true, items: all, sl, sr, h: Math.max(W.height, last.l + 24, last.r + 24) });
  }, []);

  useLayoutEffect(() => {
    layout();
    const ro = new ResizeObserver(layout);
    if (wrap.current) ro.observe(wrap.current);
    document.fonts?.ready.then(layout);
    return () => ro.disconnect();
  }, [layout]);

  // 吹き出しを選んだ部品のそばに置く。画面に収まる側（上を優先）に出し、部品そのものは隠さない
  const place = useCallback(() => {
    const el = wrap.current;
    const t = tipRef.current;
    const node = el?.querySelector<HTMLElement>(`.sheet [data-part="${selected}"]`);
    if (!el || !t || !node) return setTip(null);
    const W = el.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const h = t.offsetHeight;
    const w = Math.min(BUBBLE_W, W.width - 8);
    const below = r.top - h - 14 < 8;
    const left = Math.max(4, Math.min(r.left - W.left + r.width / 2 - w / 2, W.width - w - 4));
    const top = below ? r.bottom - W.top + 12 : r.top - W.top - h - 12;
    // 三角は部品の真ん中を指す（吹き出しの端の角丸にはかからない）
    const arrow = Math.max(16, Math.min(r.left - W.left + r.width / 2 - left, w - 16));
    setTip((cur) => (cur && cur.left === left && cur.top === top && cur.width === w && cur.arrow === arrow && cur.below === below ? cur : { left, top, width: w, arrow, below }));
  }, [selected]);
  useLayoutEffect(() => {
    // 閉じたときの位置は残してよい（次に開くときは描く前に測り直す）
    if (bubble) place();
  }, [bubble, place, lines]);
  useEffect(() => {
    if (!bubble) return;
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [bubble, place]);

  const hot = (id: string) => id === selected || id === hover;
  const pick = (id: string) => onPick(id, !lines.wide);

  return (
    <MapCtx.Provider value={{ hover, setHover, onPick: pick, selected }}>
      <div ref={wrap} className={`drawing ${lines.wide ? "is-wide" : "is-narrow"}`} style={lines.wide ? { minHeight: lines.h } : undefined}>
        {/* 狭い幅の見方。名前は書き込まず、押した部品だけ吹き出しで名前を出す */}
        <p className="map-hint">部品をタップすれば、名前がでます</p>
        {bubble && !lines.wide && (
          <div
            ref={tipRef}
            className={`map-bubble ${tip?.below ? "below" : "above"}`}
            style={{ left: tip?.left ?? 0, top: tip?.top ?? 0, width: tip?.width ?? BUBBLE_W, visibility: tip ? "visible" : "hidden", ["--arrow" as string]: `${tip?.arrow ?? 24}px` }}
          >
            {bubble}
          </div>
        )}
        {lines.wide && (
          <svg className="leaders" aria-hidden="true" width="100%" height={lines.h}>
            {lines.items.map((c) => {
              const bend = c.side === "l" ? lines.sl - 8 : lines.sr + 8;
              const end = c.side === "l" ? lines.sl - 22 : lines.sr + 22;
              return (
                <g key={c.id} className={hot(c.id) ? "hot" : ""}>
                  {/* 白い紙の上でも見えるよう、インクの縁の上に白い線を重ねる */}
                  <path className="halo" d={`M${c.ex} ${c.ey} L${bend} ${c.y} L${end} ${c.y}`} />
                  <path d={`M${c.ex} ${c.ey} L${bend} ${c.y} L${end} ${c.y}`} />
                  <circle cx={c.ex} cy={c.ey} r={3.5} />
                </g>
              );
            })}
          </svg>
        )}
        {lines.wide &&
          lines.items.map((c) => {
            const p = PART_MAP[c.id];
            const style: CSSProperties = c.side === "l" ? { right: `calc(100% - ${lines.sl - 28}px)`, top: c.y - 10 } : { left: lines.sr + 28, top: c.y - 10 };
            return (
              <button
                key={c.id}
                type="button"
                className={`callout ${c.side} ${hot(c.id) ? "hot" : ""} ${selected === c.id ? "sel" : ""}`}
                style={style}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick(c.id, false)}
              >
                {p.ja}
                <small>{shortEn(p)}</small>
              </button>
            );
          })}

        {/* 見本のスマホ（もりカフェのアプリの「お店をさがす」画面） */}
        <div className="sheet kit phone-sheet" style={VARS}>
          <div className="map">
            <Spot id="dynamic-island" as="span" className="map-island"><span className="ph-island" /></Spot>
            <Spot id="status-bar" className="map-status">
              <div className="ph-status"><span className="ph-time">9:41</span><StatusIcons /></div>
            </Spot>
            <Spot id="nav-bar">
              <div className="ph-nav">
                <Spot id="back-button" as="span">
                  <span className="ph-back"><Icon name="chevronLeft" size={20} stroke={2.2} />ホーム</span>
                </Spot>
                {/* ラージタイトルの画面なので、バーの中の題は空（右のボタンを右端に置くための場所） */}
                <b className="ph-nav-t" />
                <span className="ph-nav-r">
                  <Spot id="badge" as="span">
                    <span className="k-anchor"><Icon name="bell" size={22} /><span className="ph-badge">3</span></span>
                  </Spot>
                </span>
              </div>
            </Spot>
            <div className="map-scroll">
              <Spot id="large-title"><h3 className="ph-large">お店をさがす</h3></Spot>
              <Spot id="search-bar"><SearchBar value="" cancel={false} /></Spot>
              <Spot id="segmented"><Segmented /></Spot>
              <Spot id="chip"><Chips static /></Spot>
              <Spot id="carousel">
                <Carousel
                  wrapFirst={(n) => <Spot id="card" as="span">{n}</Spot>}
                  wrapDots={(n) => <Spot id="page-control" as="span" className="map-dots">{n}</Spot>}
                />
              </Spot>
              <Spot id="section-header"><small className="ph-sh">近くのお店</small></Spot>
              <div className="ph-list">
                <div className="ph-cell">
                  <Spot id="avatar" as="span"><span className="ph-av">{SHOPS[0].ch}</span></Spot>
                  <span className="ph-cell-t"><b>{SHOPS[0].name}</b><small>{SHOPS[0].sub}</small></span>
                  <Spot id="disclosure" as="span"><span className="ph-chev"><Icon name="chevronRight" size={16} stroke={2.2} /></span></Spot>
                </div>
                <Spot id="swipe-action">
                  <div className="ph-swipe-row">
                    <div className="ph-swipe-cell"><Cell s={SHOPS[1]} /></div>
                    <span className="ph-swipe-btn"><Icon name="trash" size={18} />削除</span>
                  </div>
                </Spot>
                <Spot id="list-cell"><Cell s={SHOPS[2]} /></Spot>
              </div>
            </div>
            {/* FAB とスナックバーは下のタブバーの上に浮かせる */}
            <Spot id="fab" as="span" className="map-fab">
              <button type="button" className="ph-fab" aria-label="新しい予約" tabIndex={-1}><Icon name="plus" size={24} stroke={2.2} /></button>
            </Spot>
            <Spot id="snackbar" className="map-snack">
              <div className="ph-snack" role="status"><span>お気に入りから外しました</span><button type="button" tabIndex={-1}>元に戻す</button></div>
            </Spot>
            <Spot id="tab-bar" className="map-tabs">
              <nav className="ph-tabs" aria-label="タブバー">
                {([["home", "ホーム"], ["search", "さがす"], ["calendar", "予約"], ["user", "マイページ"]] as const).map(([ic, t], i) => (
                  <span key={t} className={`ph-tab ${i === 1 ? "is-on" : ""}`}><Icon name={ic} size={22} />{t}</span>
                ))}
              </nav>
            </Spot>
            <Spot id="home-indicator" as="span" className="map-home"><span className="ph-home" /></Spot>
          </div>
        </div>
      </div>
    </MapCtx.Provider>
  );
}
