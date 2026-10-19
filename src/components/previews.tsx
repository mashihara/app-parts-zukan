"use client";
// 部品の見本。小さなスマホの画面（Phone）の中に、カフェの予約アプリ「もりカフェ」の部品として描く。
// 中身は src/lib/parts.ts の「AIへの頼み方の例」とそろえる（例が削除なら見本も削除）。
// 色・角などは親の .kit に流したCSS変数（--k-*）、スマホの形は components/app-kit.css。
import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "./Icon";

// ---- 共通の小物 ----

// ステータスバーの右側（電波・Wi-Fi・電池）
export function StatusIcons() {
  return (
    <svg className="ph-sicons" width="54" height="12" viewBox="0 0 54 12" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="6" width="3" height="6" rx="1" />
      <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="1" width="3" height="11" rx="1" />
      <path d="M21 4.6a8.5 8.5 0 0 1 11 0M23.2 7a5.2 5.2 0 0 1 6.6 0M25.4 9.4a2 2 0 0 1 2.2 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="36.5" y="1.5" width="15" height="9" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
      <rect x="38" y="3" width="10" height="6" rx="1.4" />
      <rect x="52.5" y="4.5" width="1.4" height="3" rx="0.7" fillOpacity="0.45" />
    </svg>
  );
}

export function StatusBar({ light = false, hl = false }: { light?: boolean; hl?: boolean }) {
  return (
    <div className={`ph-status ${light ? "is-light" : ""} ${hl ? "ph-hl" : ""}`}>
      <span className="ph-time">9:41</span>
      <StatusIcons />
    </div>
  );
}

// 見本を描く小さなスマホ。上にステータスバーとダイナミックアイランド、下にホームインジケーター
function Phone({
  children, h = 320, light = false, bg, island = true, home = true, hlIsland = false, hlHome = false, hlStatus = false,
}: {
  children?: ReactNode; h?: number; light?: boolean; bg?: string; island?: boolean; home?: boolean;
  hlIsland?: boolean; hlHome?: boolean; hlStatus?: boolean;
}) {
  return (
    <div className={`ph ${light ? "is-light" : ""}`} style={{ height: h, background: bg }}>
      {island && <span className={`ph-island ${hlIsland ? "ph-hl" : ""}`} aria-hidden="true" />}
      <StatusBar light={light} hl={hlStatus} />
      <div className="ph-body">{children}</div>
      {home && <span className={`ph-home ${hlHome ? "ph-hl" : ""}`} aria-hidden="true" />}
    </div>
  );
}

// 後ろに敷く、ぼんやりした一覧（窓の見本の背景）
function Ghost({ n = 4 }: { n?: number }) {
  return (
    <div className="ph-ghost" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="ph-ghost-row"><span className="g-av" /><span className="g-l"><i /><i /></span></div>
      ))}
    </div>
  );
}

// 何度でも見られるよう、出る動きをやり直す
const useReplay = (delay = 260) => {
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(true);
  const replay = () => {
    setOpen(false);
    setN((x) => x + 1);
  };
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(t);
  }, [open, n, delay]);
  return { open, replay, key: n };
};

function Replay({ onClick, label = "もう一度" }: { onClick: () => void; label?: string }) {
  return <button type="button" className="k-replay" onClick={onClick}>{label}</button>;
}

export function NavBar({ title = "", back, right, hl, hlBack, large }: { title?: string; back?: string; right?: ReactNode; hl?: boolean; hlBack?: boolean; large?: boolean }) {
  return (
    <div className={`ph-nav ${hl ? "ph-hl" : ""}`}>
      <span className={`ph-back ${hlBack ? "ph-hl" : ""}`} style={{ visibility: back === undefined ? "hidden" : "visible" }}>
        <Icon name="chevronLeft" size={20} stroke={2.2} /><span className="ph-back-t">{back}</span>
      </span>
      {!large && <b className="ph-nav-t">{title}</b>}
      <span className="ph-nav-r">{right}</span>
    </div>
  );
}

export function TabBar({ on = 0, badge, hl, hlBadge }: { on?: number; badge?: string; hl?: boolean; hlBadge?: boolean }) {
  const tabs: [string, string][] = [["home", "ホーム"], ["search", "さがす"], ["calendar", "予約"], ["user", "マイページ"]];
  return (
    <nav className={`ph-tabs ${hl ? "ph-hl" : ""}`} aria-label="タブバー">
      {tabs.map(([ic, t], i) => (
        <span key={t} className={`ph-tab ${i === on ? "is-on" : ""}`}>
          <span className="k-anchor">
            <Icon name={ic} size={22} />
            {badge && i === 2 && <span className={`ph-badge ${hlBadge ? "ph-hl" : ""}`}>{badge}</span>}
          </span>
          {t}
        </span>
      ))}
    </nav>
  );
}

export const SHOPS = [
  { name: "森のコーヒー 駅前店", sub: "徒歩3分・空席あり", ch: "森" },
  { name: "喫茶 こもれび", sub: "徒歩6分・空席あり", ch: "こ" },
  { name: "ひだまり珈琲", sub: "徒歩9分・残りわずか", ch: "ひ" },
  { name: "カフェ ゆずりは", sub: "徒歩12分・空席あり", ch: "ゆ" },
];

export function Cell({ s, chevron = true, hlChevron = false }: { s: (typeof SHOPS)[number]; chevron?: boolean; hlChevron?: boolean }) {
  return (
    <div className="ph-cell">
      <span className="ph-av">{s.ch}</span>
      <span className="ph-cell-t"><b>{s.name}</b><small>{s.sub}</small></span>
      {chevron && <Chev hl={hlChevron} />}
    </div>
  );
}

const Chev = ({ hl = false }: { hl?: boolean }) => <span className={`ph-chev ${hl ? "ph-hl" : ""}`}><Icon name="chevronRight" size={16} stroke={2.2} /></span>;

function Sw({ init = true }: { init?: boolean }) {
  const [on, setOn] = useState(init);
  return <button type="button" role="switch" aria-checked={on} aria-label="スイッチ" className="ph-switch" onClick={() => setOn(!on)}><span /></button>;
}

// 指の印（ジェスチャーの見本で使う）
const Finger = ({ className = "" }: { className?: string }) => <span className={`ph-finger ${className}`} aria-hidden="true" />;

// ---- 画面の骨組み ----

function SafeArea() {
  return (
    <Phone h={340} bg="linear-gradient(160deg,#5b8c6e,#2f5d47)" light>
      <span className="ph-unsafe top" aria-hidden="true" />
      <span className="ph-unsafe bottom" aria-hidden="true" />
      <div className="ph-safe ph-hl">
        <b>セーフエリア</b>
        <small>ボタンと文字はこの内側</small>
        <button type="button" className="ph-btn">予約する</button>
      </div>
    </Phone>
  );
}

function Toolbar() {
  return (
    <Phone h={320} bg="#111" light>
      <div className="ph-photo big" aria-hidden="true"><Icon name="image" size={44} stroke={1.2} /></div>
      <div className="ph-toolbar ph-hl" role="toolbar" aria-label="ツールバー">
        <Icon name="upload" size={22} /><Icon name="heart" size={22} /><Icon name="trash" size={22} />
      </div>
    </Phone>
  );
}

// ---- 画面の移り方 ----

function PushDemo() {
  const r = useReplay(500);
  return (
    <div className="ph-stage">
      <Phone h={320}>
        <NavBar large />
        <h3 className="ph-large">お店をさがす</h3>
        {SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}
        {r.open && (
          <div className="ph-pushed" key={r.key}>
            <NavBar title="森のコーヒー" back="お店をさがす" />
            <div className="ph-photo" aria-hidden="true"><Icon name="coffee" size={36} stroke={1.3} /></div>
            <div className="ph-pad"><b>森のコーヒー 駅前店</b><small className="ph-muted">渋谷駅から徒歩3分</small></div>
          </div>
        )}
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function ModalPresent() {
  const r = useReplay(500);
  return (
    <div className="ph-stage">
      <Phone h={320}>
        <NavBar title="予約" right={<Icon name="plus" size={22} />} />
        {SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}
        {r.open && (
          <div className="ph-presented" key={r.key}>
            <div className="ph-modal-bar"><span className="ph-link">キャンセル</span><b>新しい予約</b><span className="ph-link b">保存</span></div>
            <div className="ph-pad ph-form">
              <span className="ph-flabel">お店</span><span className="ph-input">森のコーヒー 駅前店</span>
              <span className="ph-flabel">日時</span><span className="ph-input">10月20日（火）14:00</span>
            </div>
          </div>
        )}
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function Splash() {
  return (
    <Phone h={320} bg="#2f7a57" light>
      <div className="ph-center"><span className="ph-appicon"><Icon name="coffee" size={34} stroke={2} /></span></div>
    </Phone>
  );
}

function Onboarding() {
  const [i, setI] = useState(0);
  const pages = [["coffee", "近くのカフェの空き席が分かる"], ["calendar", "そのまま席を予約できる"], ["bell", "前日にお知らせが届く"]];
  return (
    <Phone h={340}>
      <div className="ph-onb">
        <span className="ph-link ph-skip">スキップ</span>
        <span className="ph-onb-ill"><Icon name={pages[i][0]} size={44} stroke={1.4} /></span>
        <b>{pages[i][1]}</b>
        <Dots n={3} on={i} onPick={setI} />
        <button type="button" className="ph-btn" onClick={() => setI((i + 1) % 3)}>{i === 2 ? "はじめる" : "次へ"}</button>
      </div>
    </Phone>
  );
}

function DeepLink() {
  return (
    <div className="ph-stage row">
      <div className="ph-mail" aria-label="メール">
        <small><Icon name="mail" size={14} />もりカフェ</small>
        <b>ご予約の確認</b>
        <p>10月20日 14:00 森のコーヒー</p>
        <span className="ph-link u">予約を見る</span>
      </div>
      <span className="ph-arrow" aria-hidden="true">→</span>
      <Phone h={280}>
        <NavBar title="予約の詳細" back="予約" />
        <div className="ph-pad ph-detail">
          <small className="ph-muted">10月20日（火）14:00</small>
          <b>森のコーヒー 駅前店</b>
          <span className="ph-muted">2名・禁煙席</span>
        </div>
      </Phone>
    </div>
  );
}

// ---- 指の動き ----

function LongPress() {
  return (
    <Phone h={320}>
      <NavBar title="お店をさがす" />
      <div className="ph-list">
        <div className="ph-press"><Cell s={SHOPS[0]} chevron={false} /><Finger className="hold" /></div>
        {SHOPS.slice(1, 3).map((s) => <Cell key={s.name} s={s} />)}
      </div>
      <p className="ph-caption">押したまま 0.5秒</p>
    </Phone>
  );
}

function Swipe() {
  return (
    <Phone h={320}>
      <NavBar title="森のコーヒー" back="戻る" />
      <div className="ph-swipe-photos">
        <div className="ph-swipe-track"><span><Icon name="coffee" size={40} stroke={1.3} /></span><span><Icon name="image" size={40} stroke={1.3} /></span></div>
        <Finger className="swipe" />
      </div>
      <Dots n={2} on={0} />
    </Phone>
  );
}

function SwipeAction() {
  return (
    <Phone h={300}>
      <NavBar title="お気に入り" />
      <div className="ph-list">
        <Cell s={SHOPS[1]} />
        <div className="ph-swipe-row">
          <div className="ph-swipe-cell"><Cell s={SHOPS[0]} /></div>
          <span className="ph-swipe-btn"><Icon name="trash" size={18} />削除</span>
        </div>
        <Cell s={SHOPS[2]} />
      </div>
    </Phone>
  );
}

function PullToRefresh() {
  return (
    <Phone h={320}>
      <NavBar title="お知らせ" />
      <div className="ph-ptr"><span className="k-spinner" role="status" aria-label="読み込み中" /></div>
      <div className="ph-list">
        {["明日 14:00 のご予約です", "ポイントが貯まりました", "新しいお店が増えました"].map((t) => (
          <div key={t} className="ph-cell"><span className="ph-av"><Icon name="bell" size={16} /></span><span className="ph-cell-t"><b>{t}</b><small>10月19日</small></span></div>
        ))}
      </div>
      <Finger className="pull" />
    </Phone>
  );
}

function Pinch() {
  return (
    <Phone h={320} bg="#111" light>
      <div className="ph-pinch"><span className="ph-pinch-img"><Icon name="coffee" size={60} stroke={1.2} /></span><Finger className="p1" /><Finger className="p2" /></div>
    </Phone>
  );
}

function EdgeSwipe() {
  return (
    <Phone h={320}>
      <div className="ph-under"><NavBar large /><h3 className="ph-large">お店をさがす</h3>{SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}</div>
      <div className="ph-pushed edge">
        <NavBar title="森のコーヒー" back="お店をさがす" />
        <div className="ph-photo" aria-hidden="true"><Icon name="coffee" size={36} stroke={1.3} /></div>
        <div className="ph-pad"><b>森のコーヒー 駅前店</b></div>
      </div>
      <Finger className="edge" />
    </Phone>
  );
}

function DragReorder() {
  return (
    <Phone h={320}>
      <NavBar title="お気に入り" right={<span className="ph-link b">完了</span>} />
      <div className="ph-list">
        {[SHOPS[1], SHOPS[0], SHOPS[2]].map((s, i) => (
          <div key={s.name} className={`ph-drag ${i === 1 ? "is-lift" : ""}`}>
            <Cell s={s} chevron={false} />
            <span className="ph-grip" aria-label="並べ替え"><Icon name="menu" size={18} /></span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function Haptics() {
  return (
    <div className="ph-buzz">
      <svg className="ph-wave" width="22" height="56" viewBox="0 0 22 56" aria-hidden="true"><path d="M16 6c-9 12-9 32 0 44M8 14c-5 8-5 20 0 28" /></svg>
      <Phone h={250}>
        <NavBar title="設定" />
        <div className="ph-group"><div className="ph-row">予約の前日に通知する<Sw /></div></div>
      </Phone>
      <svg className="ph-wave" width="22" height="56" viewBox="0 0 22 56" aria-hidden="true" style={{ transform: "scaleX(-1)" }}><path d="M16 6c-9 12-9 32 0 44M8 14c-5 8-5 20 0 28" /></svg>
    </div>
  );
}

// ---- 重なって出る窓 ----

function Scrim({ children, open, blur = false }: { children: ReactNode; open: boolean; blur?: boolean }) {
  return <div className={`ph-scrim ${open ? "is-open" : ""} ${blur ? "blur" : ""}`}>{children}</div>;
}

function BottomSheet() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={340}>
        <NavBar title="お店をさがす" right={<span className="ph-link">絞り込み</span>} />
        <Ghost />
        <Scrim open={r.open}>
          <div className={`ph-sheet ${r.open ? "is-open" : ""}`} key={r.key}>
            <span className="ph-grabber" aria-hidden="true" />
            <b className="ph-sheet-t">絞り込み</b>
            <div className="ph-chips"><span className="ph-chip is-on">電源あり</span><span className="ph-chip is-on">Wi-Fi</span><span className="ph-chip">テラス席</span></div>
            <div className="ph-row">空席のあるお店だけ<Sw /></div>
          </div>
        </Scrim>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function ActionSheet() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={340} bg="#111" light>
        <div className="ph-photo big" aria-hidden="true"><Icon name="image" size={44} stroke={1.2} /></div>
        <Scrim open={r.open}>
          <div className={`ph-asheet ${r.open ? "is-open" : ""}`} key={r.key} role="menu" aria-label="アクションシート">
            <div className="ph-agroup">
              <button type="button" role="menuitem">写真を保存</button>
              <button type="button" role="menuitem">共有</button>
              <button type="button" role="menuitem" className="danger">削除</button>
            </div>
            <div className="ph-agroup"><button type="button" role="menuitem" className="b">キャンセル</button></div>
          </div>
        </Scrim>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function AlertDemo() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={320}>
        <NavBar title="マイページ" />
        <Ghost />
        <Scrim open={r.open}>
          <div className={`ph-alert ${r.open ? "is-open" : ""}`} key={r.key} role="alertdialog" aria-label="ログアウトしますか？">
            <div className="ph-alert-body"><b>ログアウトしますか？</b><small>予約の情報は消えません。</small></div>
            <div className="ph-alert-btns"><button type="button">キャンセル</button><button type="button" className="danger b">ログアウト</button></div>
          </div>
        </Scrim>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function Snackbar() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={320}>
        <NavBar title="お気に入り" />
        <div className="ph-list">{SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}</div>
        {r.open && (
          <div className="ph-snack" key={r.key} role="status">
            <span>お気に入りから外しました</span><button type="button">元に戻す</button>
          </div>
        )}
        <TabBar on={3} />
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function Toast() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={320}>
        <NavBar title="森のコーヒー" back="戻る" />
        <div className="ph-pad ph-detail"><small className="ph-muted">住所</small><b>東京都渋谷区道玄坂 1-2-3</b><span className="ph-link"><Icon name="copy" size={14} />コピー</span></div>
        {r.open && <div className="ph-toast" key={r.key} role="status">コピーしました</div>}
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function ContextMenu() {
  return (
    <Phone h={340}>
      <NavBar title="お店をさがす" />
      <Ghost n={5} />
      <Scrim open blur>
        <div className="ph-ctx">
          <div className="ph-lifted"><Cell s={SHOPS[0]} chevron={false} /></div>
          <div className="ph-ctx-menu" role="menu" aria-label="コンテキストメニュー">
            <button type="button" role="menuitem">共有<Icon name="upload" size={16} /></button>
            <button type="button" role="menuitem">お気に入り<Icon name="heart" size={16} /></button>
            <button type="button" role="menuitem" className="danger">非表示<Icon name="x" size={16} /></button>
          </div>
        </div>
      </Scrim>
    </Phone>
  );
}

function ShareSheet() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={340}>
        <NavBar title="森のコーヒー" back="戻る" right={<Icon name="upload" size={20} />} />
        <Ghost />
        <Scrim open={r.open}>
          <div className={`ph-sheet ${r.open ? "is-open" : ""}`} key={r.key}>
            <div className="ph-share-head"><span className="ph-av sq"><Icon name="coffee" size={18} /></span><span><b>森のコーヒー 駅前店</b><small>moricafe.example/shop/1</small></span></div>
            <div className="ph-share-apps">
              {[["mail", "メール"], ["inbox", "メッセージ"], ["user", "連絡先"], ["more", "その他"]].map(([ic, t]) => (
                <span key={t}><i><Icon name={ic} size={20} /></i>{t}</span>
              ))}
            </div>
            <div className="ph-group"><div className="ph-row">コピー<Icon name="copy" size={16} /></div></div>
          </div>
        </Scrim>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function NavDrawer() {
  const r = useReplay();
  return (
    <div className="ph-stage">
      <Phone h={340}>
        <div className="ph-nav"><span className="ph-back"><Icon name="menu" size={20} /></span><b className="ph-nav-t">もりカフェ</b><span className="ph-nav-r" /></div>
        <Ghost />
        <Scrim open={r.open}>
          <nav className={`ph-drawer ${r.open ? "is-open" : ""}`} key={r.key} aria-label="ナビゲーションドロワー">
            <div className="ph-drawer-head"><span className="ph-av">森</span><b>森 はな</b></div>
            {[["gear", "設定"], ["info", "ヘルプ"], ["x", "ログアウト"]].map(([ic, t]) => (
              <span key={t} className="ph-drawer-item"><Icon name={ic} size={18} />{t}</span>
            ))}
          </nav>
        </Scrim>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function PermissionDialog() {
  return (
    <Phone h={340}>
      <NavBar title="お店をさがす" />
      <Ghost />
      <Scrim open>
        <div className="ph-alert is-open" role="alertdialog" aria-label="位置情報の許可">
          <div className="ph-alert-body">
            <b>“もりカフェ”に位置情報の使用を許可しますか？</b>
            <small>近くのカフェをさがすために使います。</small>
          </div>
          <div className="ph-alert-btns col">
            <button type="button">1度だけ許可</button>
            <button type="button">アプリの使用中は許可</button>
            <button type="button">許可しない</button>
          </div>
        </div>
      </Scrim>
    </Phone>
  );
}

function Keyboard() {
  return (
    <Phone h={360} home={false}>
      <NavBar title="予約" back="戻る" />
      <div className="ph-pad ph-form">
        <span className="ph-flabel">電話番号</span>
        <span className="ph-input is-focus">090-1234-<i className="ph-caret" /></span>
      </div>
      <div className="ph-kbd" aria-label="数字のキーボード">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) => <span key={i} className={k ? "" : "blank"}>{k}</span>)}
      </div>
    </Phone>
  );
}

// ---- 押す・入れる・選ぶ ----

function Stepper() {
  const [n, setN] = useState(2);
  return (
    <div className="ph-panel">
      <div className="ph-group">
        <div className="ph-row">
          <span>人数 <b>{n}名</b></span>
          <span className="ph-stepper">
            <button type="button" aria-label="減らす" disabled={n <= 1} onClick={() => setN(n - 1)}><Icon name="minus" size={18} /></button>
            <button type="button" aria-label="増やす" disabled={n >= 8} onClick={() => setN(n + 1)}><Icon name="plus" size={18} /></button>
          </span>
        </div>
      </div>
    </div>
  );
}

function Wheel({ items, init, label }: { items: string[]; init: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = init * 32;
  }, [init]);
  return (
    <div className="ph-wheel" ref={ref} tabIndex={0} aria-label={label}>
      <span className="pad" />
      {items.map((t) => <span key={t}>{t}</span>)}
      <span className="pad" />
    </div>
  );
}

function Picker() {
  return (
    <div className="ph-panel">
      <div className="ph-picker">
        <span className="ph-picker-band" aria-hidden="true" />
        <Wheel label="時" items={["10時", "11時", "12時", "13時", "14時", "15時", "16時", "17時"]} init={4} />
        <Wheel label="分" items={["00分", "15分", "30分", "45分"]} init={0} />
      </div>
    </div>
  );
}

function DatePicker() {
  const [sel, setSel] = useState(20);
  // 2026年10月。1日は木曜。水曜は定休日、今日は19日
  const first = 4;
  const cells = [...Array<number>(first).fill(0), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  return (
    <div className="ph-panel">
      <div className="ph-cal">
        <div className="ph-cal-head"><b>2026年10月</b><span><Icon name="chevronLeft" size={16} /><Icon name="chevronRight" size={16} /></span></div>
        <div className="ph-cal-grid">
          {["日", "月", "火", "水", "木", "金", "土"].map((d) => <small key={d}>{d}</small>)}
          {cells.map((d, i) => {
            const off = d < 19 || i % 7 === 3;
            return d === 0 ? <span key={i} /> : (
              <button key={i} type="button" disabled={off} className={d === sel ? "is-on" : ""} onClick={() => setSel(d)}>{d}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState(1.5);
  return (
    <div className="ph-panel">
      <div className="ph-group">
        <div className="ph-slider">
          <span>現在地から <b>{v.toFixed(1)}km</b> 以内</span>
          <input type="range" min={0.5} max={5} step={0.5} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="距離" />
          <span className="ph-slider-ends"><small>0.5km</small><small>5km</small></span>
        </div>
      </div>
    </div>
  );
}

export function SearchBar({ value = "渋谷", cancel = true }: { value?: string; cancel?: boolean }) {
  return (
    <div className="ph-searchrow">
      <label className="ph-search"><Icon name="search" size={16} /><input defaultValue={value} placeholder="駅名・お店の名前" aria-label="検索" tabIndex={cancel ? 0 : -1} /></label>
      {cancel && <span className="ph-link">キャンセル</span>}
    </div>
  );
}

function TextField() {
  const [v, setV] = useState("");
  const err = !v;
  return (
    <div className="ph-panel">
      <label className={`ph-tf ${err ? "is-error" : ""}`}>
        <span className="ph-flabel">お名前</span>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="森 はな" />
        {err && <small>お名前を入れてください</small>}
      </label>
    </div>
  );
}

export function Chips({ static: still = false }: { static?: boolean }) {
  const [on, setOn] = useState<string[]>(["電源あり", "Wi-Fi"]);
  return (
    <div className="ph-chips scroll">
      {["電源あり", "Wi-Fi", "テラス席", "禁煙"].map((t) => (
        <button key={t} type="button" tabIndex={still ? -1 : 0} aria-pressed={on.includes(t)} className={`ph-chip ${on.includes(t) ? "is-on" : ""}`} onClick={() => setOn(on.includes(t) ? on.filter((x) => x !== t) : [...on, t])}>
          {on.includes(t) && <Icon name="check" size={14} stroke={2.4} />}{t}
        </button>
      ))}
    </div>
  );
}

export function Segmented({ items = ["一覧", "地図"], init = 0 }: { items?: string[]; init?: number }) {
  const [i, setI] = useState(init);
  return (
    <div className="ph-seg" role="radiogroup" aria-label="表示の切り替え">
      {items.map((t, k) => <button key={t} type="button" role="radio" aria-checked={i === k} onClick={() => setI(k)}>{t}</button>)}
    </div>
  );
}

// ---- 並べて見せる ----

export function Dots({ n, on, onPick }: { n: number; on: number; onPick?: (i: number) => void }) {
  return (
    <span className="ph-dots" role="group" aria-label={`${n}枚中${on + 1}枚目`}>
      {Array.from({ length: n }, (_, i) => <button key={i} type="button" className={i === on ? "is-on" : ""} aria-label={`${i + 1}枚目`} onClick={() => onPick?.(i)} />)}
    </span>
  );
}

const PICKS = [
  { name: "森のコーヒー", sub: "渋谷駅 徒歩3分", ic: "coffee" },
  { name: "喫茶 こもれび", sub: "代官山駅 徒歩5分", ic: "star" },
  { name: "ひだまり珈琲", sub: "恵比寿駅 徒歩4分", ic: "heart" },
];

export function CardItem({ p = PICKS[0] }: { p?: (typeof PICKS)[number] }) {
  return (
    <div className="ph-card">
      <span className="ph-card-img" aria-hidden="true"><Icon name={p.ic} size={30} stroke={1.3} /></span>
      <span className="ph-card-b"><b>{p.name}</b><small>{p.sub}</small></span>
    </div>
  );
}

// カルーセル。図面では card と page-control に別々に名前を付けるため、中の部品を差し込めるようにする
export function Carousel({ wrapFirst, wrapDots }: { wrapFirst?: (n: ReactNode) => ReactNode; wrapDots?: (n: ReactNode) => ReactNode }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const step = () => ((ref.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0) + 10;
  const dots = (
    <Dots n={PICKS.length} on={i} onPick={(k) => ref.current?.scrollTo({ left: k * step(), behavior: "smooth" })} />
  );
  return (
    <div className="ph-carousel-wrap">
      <div className="ph-carousel" ref={ref} onScroll={(e) => setI(Math.min(PICKS.length - 1, Math.round(e.currentTarget.scrollLeft / (step() || 1))))}>
        {PICKS.map((p, k) => {
          const card = <CardItem key={p.name} p={p} />;
          return k === 0 && wrapFirst ? <span className="ph-carousel-item" key={p.name}>{wrapFirst(card)}</span> : <span className="ph-carousel-item" key={p.name}>{card}</span>;
        })}
      </div>
      {wrapDots ? wrapDots(dots) : dots}
    </div>
  );
}

function GroupedList() {
  return (
    <Phone h={420} bg="#f2f2f7">
      <h3 className="ph-large sm">設定</h3>
      <small className="ph-gh">通知</small>
      <div className="ph-group"><div className="ph-row">予約の前日に通知する<Sw /></div><div className="ph-row">お知らせ<Sw init={false} /></div></div>
      <small className="ph-gh">アカウント</small>
      <div className="ph-group"><div className="ph-row">プロフィール<Chev /></div><div className="ph-row">支払い方法<Chev /></div></div>
      <small className="ph-gh">このアプリについて</small>
      <div className="ph-group"><div className="ph-row">利用規約<Chev /></div></div>
    </Phone>
  );
}

function PageControlDemo() {
  const [i, setI] = useState(1);
  return (
    <div className="ph-pc">
      <span className="ph-pc-card" aria-hidden="true"><Icon name={PICKS[i].ic} size={34} stroke={1.3} /></span>
      <Dots n={3} on={i} onPick={setI} />
    </div>
  );
}

// ---- 状態を伝える ----

function ProgressDemo() {
  const r = useReplay(200);
  return (
    <div className="ph-stage">
      <Phone h={300}>
        <NavBar title="写真を送る" back="戻る" />
        <div className="ph-progress" role="progressbar" aria-label="送信の進み具合"><span key={r.key} /></div>
        <div className="ph-photo" aria-hidden="true"><Icon name="image" size={40} stroke={1.3} /></div>
        <p className="ph-caption">送信中… 3枚中2枚</p>
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function Skeleton() {
  return (
    <Phone h={320}>
      <NavBar title="お店をさがす" />
      <div className="ph-skel" aria-busy="true" aria-label="読み込み中">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="ph-skel-row"><span className="s-av" /><span className="s-l"><i /><i /></span></div>)}
      </div>
    </Phone>
  );
}

function Empty() {
  return (
    <Phone h={320}>
      <NavBar title="お気に入り" />
      <div className="ph-empty">
        <span className="ph-empty-ill"><Icon name="heart" size={40} stroke={1.4} /></span>
        <b>お気に入りはまだありません</b>
        <small>気になるお店のハートを押すと、ここに並びます。</small>
        <button type="button" className="ph-btn sm">お店をさがす</button>
      </div>
    </Phone>
  );
}

function PushNotification() {
  const r = useReplay(400);
  return (
    <div className="ph-stage">
      <Phone h={320} bg="linear-gradient(170deg,#3c5f8a,#1d2c45)" light>
        <div className="ph-lock"><small>10月19日 月曜日</small><b>18:00</b></div>
        {r.open && (
          <div className="ph-notif" key={r.key}>
            <span className="ph-notif-ic"><Icon name="coffee" size={16} stroke={2} /></span>
            <span className="ph-notif-t"><small>もりカフェ<i>今</i></small><b>明日 14:00 森のコーヒーのご予約です</b></span>
          </div>
        )}
      </Phone>
      <Replay onClick={r.replay} />
    </div>
  );
}

function Widget() {
  return (
    <Phone h={320} bg="linear-gradient(170deg,#7aa7c7,#4d6f8f)" light>
      <div className="ph-home-grid">
        <div className="ph-widget">
          <small><Icon name="coffee" size={13} stroke={2} />次の予約</small>
          <b>10/20 14:00</b>
          <span>森のコーヒー</span>
        </div>
        {["#f4a261", "#2a9d8f", "#e76f51", "#8ab17d", "#457b9d", "#e9c46a", "#9d4edd", "#ef476f"].map((c, i) => <span key={i} className="ph-appdot" style={{ background: c }} />)}
      </div>
    </Phone>
  );
}

export function PartPreview({ id }: { id: string }) {
  switch (id) {
    // 画面の骨組み
    case "status-bar":
      return <Phone h={240} bg="linear-gradient(170deg,#5b8c6e,#2f5d47)" light hlStatus><div className="ph-photo clear" aria-hidden="true"><Icon name="coffee" size={44} stroke={1.2} /></div></Phone>;
    case "dynamic-island":
      return <Phone h={240} hlIsland><NavBar title="お店をさがす" /><Ghost n={2} /></Phone>;
    case "nav-bar":
      return <Phone h={240}><NavBar title="森のコーヒー" back="さがす" right={<Icon name="bell" size={20} />} hl /><Ghost n={2} /></Phone>;
    case "large-title":
      return <Phone h={260}><NavBar large right={<Icon name="bell" size={20} />} /><h3 className="ph-large ph-hl">お店をさがす</h3><Ghost n={2} /></Phone>;
    case "back-button":
      return (
        <div className="ph-stage row">
          <div className="ph-os"><small>iOS</small><Phone h={150} home={false}><NavBar title="詳細" back="お店をさがす" hlBack /></Phone></div>
          <div className="ph-os"><small>Android</small><Phone h={150} home={false} island={false}><div className="ph-nav md"><span className="ph-back ph-hl"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg></span><b className="ph-nav-t">詳細</b></div></Phone></div>
        </div>
      );
    case "tab-bar": return <Phone h={260}><NavBar title="ホーム" /><Ghost n={2} /><TabBar hl /></Phone>;
    case "toolbar": return <Toolbar />;
    case "home-indicator":
      return <Phone h={240} hlHome><NavBar title="予約" back="戻る" /><Ghost n={1} /><div className="ph-bottom-btn"><button type="button" className="ph-btn">予約する</button></div></Phone>;
    case "safe-area": return <SafeArea />;
    // 画面の移り方
    case "push": return <PushDemo />;
    case "modal-present": return <ModalPresent />;
    case "splash": return <Splash />;
    case "onboarding": return <Onboarding />;
    case "deep-link": return <DeepLink />;
    // 指の動き
    case "long-press": return <LongPress />;
    case "swipe": return <Swipe />;
    case "swipe-action": return <SwipeAction />;
    case "pull-to-refresh": return <PullToRefresh />;
    case "pinch": return <Pinch />;
    case "edge-swipe": return <EdgeSwipe />;
    case "drag-reorder": return <DragReorder />;
    case "haptics": return <Haptics />;
    // 重なって出る窓
    case "bottom-sheet": return <BottomSheet />;
    case "action-sheet": return <ActionSheet />;
    case "alert": return <AlertDemo />;
    case "snackbar": return <Snackbar />;
    case "toast": return <Toast />;
    case "context-menu": return <ContextMenu />;
    case "share-sheet": return <ShareSheet />;
    case "nav-drawer": return <NavDrawer />;
    case "permission-dialog": return <PermissionDialog />;
    case "keyboard": return <Keyboard />;
    // 押す・入れる・選ぶ
    case "button":
      return <Phone h={260}><NavBar title="予約" back="戻る" /><Ghost n={2} /><div className="ph-bottom-btn"><button type="button" className="ph-btn">予約内容を確認する</button></div></Phone>;
    case "fab":
      return (
        <Phone h={300}>
          <NavBar title="予約" />
          <div className="ph-list">{SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}</div>
          <button type="button" className="ph-fab" aria-label="新しい予約"><Icon name="plus" size={24} stroke={2.2} /></button>
          <TabBar on={2} />
        </Phone>
      );
    case "switch":
      return <div className="ph-panel grey"><div className="ph-group"><div className="ph-row">予約の前日に通知する<Sw /></div><div className="ph-row">お知らせを受け取る<Sw init={false} /></div></div></div>;
    case "segmented": return <div className="ph-panel"><Segmented /></div>;
    case "stepper": return <Stepper />;
    case "picker": return <Picker />;
    case "date-picker": return <DatePicker />;
    case "slider": return <SliderDemo />;
    case "search-bar": return <div className="ph-panel"><SearchBar /></div>;
    case "text-field": return <TextField />;
    case "chip": return <div className="ph-panel"><Chips /></div>;
    // 並べて見せる
    case "list-cell":
      return <div className="ph-panel"><div className="ph-list boxed">{SHOPS.slice(0, 3).map((s) => <Cell key={s.name} s={s} />)}</div></div>;
    case "section-header":
      return (
        <div className="ph-panel">
          <div className="ph-list boxed">
            <small className="ph-sh ph-hl">近くのお店</small>
            {SHOPS.slice(0, 2).map((s) => <Cell key={s.name} s={s} />)}
            <small className="ph-sh ph-hl">最近見たお店</small>
            <Cell s={SHOPS[3]} />
          </div>
        </div>
      );
    case "grouped-list": return <GroupedList />;
    case "disclosure":
      return <div className="ph-panel grey"><div className="ph-group"><div className="ph-row">支払い方法<Chev hl /></div><div className="ph-row">利用規約<Chev hl /></div><div className="ph-row">予約の前日に通知する<Sw /></div></div></div>;
    case "card": return <div className="ph-panel narrow"><CardItem /></div>;
    case "carousel": return <div className="ph-panel"><Carousel /></div>;
    case "page-control": return <div className="ph-panel"><PageControlDemo /></div>;
    case "avatar":
      return (
        <div className="ph-panel"><div className="ph-avs">
          <span className="ph-av lg"><Icon name="coffee" size={22} /></span><span className="ph-av lg">森</span><span className="ph-av lg">こ</span>
        </div></div>
      );
    // 状態を伝える
    case "badge":
      return (
        <div className="ph-stage row">
          <span className="ph-icon-badge"><span className="ph-appicon sm"><Icon name="coffee" size={26} stroke={2} /></span><span className="ph-badge">3</span></span>
          <Phone h={150} island={false}><Ghost n={1} /><TabBar on={0} badge="3" hlBadge /></Phone>
        </div>
      );
    case "spinner":
      return (
        <div className="ph-panel"><div className="ph-spin-row">
          <span className="k-spinner" role="status" aria-label="読み込み中" />
          <button type="button" className="ph-btn busy" aria-label="送信中"><span className="k-spinner on-accent" aria-hidden="true" /></button>
        </div></div>
      );
    case "progress-bar": return <ProgressDemo />;
    case "skeleton": return <Skeleton />;
    case "empty-state": return <Empty />;
    case "push-notification": return <PushNotification />;
    case "widget": return <Widget />;
    default: return null;
  }
}
