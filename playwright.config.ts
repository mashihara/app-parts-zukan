import { defineConfig, devices } from "@playwright/test";

// 静的書き出し（out/）を配信して確かめる。先に npm run build を実行しておく
// 別の作業ツリーと同時に検査できるよう、番号は PW_PORT で変えられる（既定 4320）
const PORT = Number(process.env.PW_PORT ?? 4320);

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: { command: `python3 -m http.server ${PORT} --directory out`, port: PORT, reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } }, grepInvert: /@mobile/ },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" }, grep: /@mobile/ },
  ],
});
