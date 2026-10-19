// 見本と画面で使う線画アイコン（24pxの格子、線の太さ1.8）
const PATHS: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.2-4.2",
  bell: "M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Zm4 10.5a2 2 0 0 0 4 0",
  menu: "M4 7h16M4 12h16M4 17h16",
  home: "M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5V11Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8c.8-3.5 3.8-5.5 7.5-5.5s6.7 2 7.5 5.5",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  x: "M6 6l12 12M18 6 6 18",
  chevronDown: "m6 9 6 6 6-6",
  chevronRight: "m9 6 6 6-6 6",
  chevronLeft: "m15 6-6 6 6 6",
  check: "m5 12.5 4.5 4.5L19 7.5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5.5M12 7.5v.5",
  alert: "M12 4 2.8 19.5h18.4L12 4Zm0 6v4.5m0 2.5v.5",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2l.4 2.6h5l.4-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  calendar: "M5 6h14v14H5zM5 10h14M9 3.5V7m6-3.5V7",
  more: "M6 12h.01M12 12h.01M18 12h.01",
  edit: "M5 19h3.5L19 8.5 15.5 5 5 15.5V19Z",
  copy: "M9 9h10v10H9zM5 15V5h10",
  trash: "M5 7h14M10 7V5h4v2m-7 0 1 12h8l1-12",
  coffee: "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Zm11 1h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1 1.5 1 3M12 3.5c0 1.5 1 1.5 1 3",
  inbox: "M4 13l2.5-7.5h11L20 13v6H4v-6Zm0 0h4.5l1 2h5l1-2H20",
  star: "m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z",
  upload: "M12 16V5m0 0-4 4m4-4 4 4M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15",
  image: "M4.5 5h15v14h-15zM4.5 16l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5M15.5 9.5h.01",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  chart: "M5 19V9m5 10V5m5 14v-7m5 7v-4M3 19.5h18",
};

export default function Icon({ name, size = 20, stroke = 1.8 }: { name: string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? ""} />
    </svg>
  );
}
