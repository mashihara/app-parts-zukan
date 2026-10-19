// 見本の部品の見た目（デザイントークン）。見本はすべてこの既定値で描く。
// React に依存しない。

export type Tokens = {
  accent: string; // 6桁の16進（# なし）
  theme: string; // light | dark
  tone: string; // neutral | warm | cool
  radius: string;
  space: string;
  shadow: string;
  border: string;
  fs: string;
  fw: string;
  font: string;
  speed: string;
  ease: string;
};

export const DEFAULT_TOKENS: Tokens = {
  accent: "2563eb",
  theme: "light",
  tone: "neutral",
  radius: "8",
  space: "1",
  shadow: "1",
  border: "1",
  fs: "16",
  fw: "700",
  font: "gothic",
  speed: "200",
  ease: "smooth",
};

export const FONTS: Record<string, { label: string; css: string; name: string }> = {
  gothic: { label: "ゴシック", css: "'Zen Kaku Gothic New', 'Hiragino Sans', sans-serif", name: "Zen Kaku Gothic New（角ゴシック）" },
  maru: { label: "丸ゴシック", css: "'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif", name: "Zen Maru Gothic（丸ゴシック）" },
  mincho: { label: "明朝", css: "'Zen Old Mincho', 'Hiragino Mincho ProN', serif", name: "Zen Old Mincho（明朝）" },
};

export const EASES: Record<string, { label: string; css: string; name: string }> = {
  smooth: { label: "なめらか", css: "cubic-bezier(0.2, 0.8, 0.2, 1)", name: "なめらかに減速（ease-out）" },
  standard: { label: "きっちり", css: "cubic-bezier(0.4, 0, 0.2, 1)", name: "加速して減速（ease-in-out）" },
  bouncy: { label: "弾む", css: "cubic-bezier(0.34, 1.56, 0.64, 1)", name: "少し行き過ぎて戻る（オーバーシュート）" },
};

// ---- 色の計算 ----
type RGB = [number, number, number];
const toRgb = (hex: string): RGB => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
};
const toHex = (c: RGB) => c.map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => {
  const x = toRgb(a), y = toRgb(b);
  return toHex([0, 1, 2].map((i) => x[i] * (1 - t) + y[i] * t) as RGB);
};
const lum = (hex: string) => {
  const c = toRgb(hex).map((n) => {
    const s = n / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a: string, b: string) => {
  const [l1, l2] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (l1 + 0.05) / (l2 + 0.05);
};
export const isHex = (s: string) => /^[0-9a-fA-F]{6}$/.test(s);

const SURFACES: Record<string, Record<string, { bg: string; surface: string; text: string; muted: string; line: string }>> = {
  light: {
    neutral: { bg: "f4f5f7", surface: "ffffff", text: "1a1c20", muted: "5f6570", line: "e2e4e9" },
    warm: { bg: "f3f0e9", surface: "fffdf9", text: "2a2620", muted: "6e675c", line: "e6e0d4" },
    cool: { bg: "eef2f7", surface: "ffffff", text: "172033", muted: "586379", line: "dce3ec" },
  },
  dark: {
    neutral: { bg: "121317", surface: "1b1d23", text: "ecedef", muted: "9a9ea8", line: "2c2f37" },
    warm: { bg: "17140f", surface: "211d17", text: "f1ece3", muted: "a69e90", line: "352f26" },
    cool: { bg: "0f141c", surface: "172030", text: "e8eef7", muted: "93a0b4", line: "263247" },
  },
};

const SHADOWS = {
  light: ["none", "0 1px 2px rgba(16,24,40,0.08)", "0 4px 12px rgba(16,24,40,0.10), 0 1px 3px rgba(16,24,40,0.06)", "0 12px 32px rgba(16,24,40,0.16), 0 2px 6px rgba(16,24,40,0.08)"],
  dark: ["none", "0 1px 2px rgba(0,0,0,0.40)", "0 4px 14px rgba(0,0,0,0.45)", "0 14px 36px rgba(0,0,0,0.55)"],
};

// 計算済みの値。見本のCSS変数と指示文の両方で使う
export type Resolved = ReturnType<typeof resolve>;

export function resolve(t: Tokens) {
  const theme = t.theme === "dark" ? "dark" : "light";
  const s = SURFACES[theme][t.tone] ?? SURFACES[theme].neutral;
  const accent = isHex(t.accent) ? t.accent.toLowerCase() : DEFAULT_TOKENS.accent;
  // 暗い画面で暗すぎる基本の色は、地の色と見分けられるよう明るくする
  const accentUse = theme === "dark" && contrast(accent, s.surface) < 3 ? mix(accent, "ffffff", 0.35) : accent;
  const onAccent = contrast(accentUse, "ffffff") >= contrast(accentUse, "111111") ? "ffffff" : "111111";
  const r = Number(t.radius);
  const pill = r >= 999;
  const sp = Number(t.space);
  const level = Math.max(0, Math.min(3, Number(t.shadow)));
  const sh = SHADOWS[theme];
  const speed = Number(t.speed);
  return {
    theme,
    accent: accentUse,
    accentHover: mix(accentUse, theme === "dark" ? "ffffff" : "000000", 0.12),
    accentSoft: mix(s.surface, accentUse, theme === "dark" ? 0.2 : 0.1),
    onAccent,
    danger: theme === "dark" ? "f87171" : "dc2626",
    success: theme === "dark" ? "4ade80" : "15803d",
    warning: theme === "dark" ? "facc15" : "b45309",
    ...s,
    radiusRaw: r,
    pill,
    // 操作部品（ボタン・入力欄）の角
    rCtl: pill ? 999 : r,
    // 大きい面（カード・モーダル）の角。ピル型でも面は楕円にしない
    rLg: pill ? 24 : Math.round(r * 1.5),
    // 小物（バッジ・チェックボックス）の角
    rSm: pill ? 999 : Math.round(r / 2),
    sp,
    u: (n: number) => Math.round(n * 4 * sp), // 4pxを基準にした余白
    level,
    shadow: sh[level],
    // 重なる窓（モーダル等）は面より一段強い影にする
    shadowPop: level === 0 ? (theme === "dark" ? sh[2] : "0 0 0 1px rgba(16,24,40,0.10)") : sh[Math.min(3, level + 1)],
    bw: Number(t.border),
    fs: Number(t.fs),
    fw: Number(t.fw),
    font: FONTS[t.font] ?? FONTS.gothic,
    speed,
    dur: `${speed}ms`,
    sec: speed === 0 ? "0秒（動かさない）" : `${speed / 1000}秒`,
    ease: EASES[t.ease] ?? EASES.smooth,
  };
}

// 見本の部品に流すCSS変数
export function cssVars(t: Tokens): Record<string, string> {
  const R = resolve(t);
  return {
    "--k-accent": `#${R.accent}`,
    "--k-accent-hover": `#${R.accentHover}`,
    "--k-accent-soft": `#${R.accentSoft}`,
    "--k-on-accent": `#${R.onAccent}`,
    "--k-danger": `#${R.danger}`,
    "--k-success": `#${R.success}`,
    "--k-warning": `#${R.warning}`,
    "--k-bg": `#${R.bg}`,
    "--k-surface": `#${R.surface}`,
    "--k-text": `#${R.text}`,
    "--k-muted": `#${R.muted}`,
    "--k-line": `#${R.line}`,
    "--k-r": `${R.rCtl}px`,
    "--k-r-lg": `${R.rLg}px`,
    "--k-r-sm": `${R.rSm}px`,
    "--k-sp": `${R.sp}`,
    "--k-shadow": R.shadow,
    "--k-shadow-pop": R.shadowPop,
    "--k-bw": `${R.bw}px`,
    // 枠線なしでも入力欄の形は見えるよう、入力欄だけは最低1pxにする
    "--k-bw-field": `${Math.max(1, R.bw)}px`,
    "--k-fs": `${R.fs}px`,
    "--k-fw": `${R.fw}`,
    "--k-font": R.font.css,
    "--k-dur": R.dur,
    "--k-ease": R.ease.css,
  };
}
