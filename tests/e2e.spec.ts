import { expect, test, type Page } from "@playwright/test";

const SHOT = process.env.SHOT_DIR;
const shot = async (page: Page, name: string) => {
  if (SHOT) await page.screenshot({ path: `${SHOT}/${name}.png` });
};
const SISTER = "https://mashiharalab.dev/ui-parts-zukan/";
// 選んだ部品の名前（見出しの h1。部品名はここ1か所に出す）
const entryName = (page: Page) => page.locator(".intro-name");
// 一覧のカード（名前で探す。見本の中の文字や、単体表示の「ほかの部品」には反応させない）
const card = (page: Page, name: string) => page.locator("#names .name-card").filter({ has: page.locator(".nc-ja", { hasText: new RegExp(`^${name}`) }) });
// 説明（重ねて開く欄）を閉じる
const closeEntry = async (page: Page) => {
  if (!(await page.locator(".drawer").count())) return; // PC幅は右の列なので閉じる物がない
  await page.keyboard.press("Escape");
  await expect(page.locator(".drawer")).toHaveCount(0);
};
// 図面の中の部品どうしが重ならないか（浮かせた部品が他の部品に重なった不具合の再発防止）
const overlap = async (page: Page, a: string, b: string) => {
  const ra = (await page.locator(`.sheet [data-part=${a}]`).boundingBox())!;
  const rb = (await page.locator(`.sheet [data-part=${b}]`).boundingBox())!;
  return ra.x < rb.x + rb.width && rb.x < ra.x + ra.width && ra.y < rb.y + rb.height && rb.y < ra.y + ra.height;
};
// 見本のスマホの中の文字や部品が、画面の右端・左端からはみ出していないか（横スクロールの中の物は除く）
const overflowing = (page: Page) =>
  page.locator(".sheet").evaluate((sheet) => {
    const s = sheet.getBoundingClientRect();
    return [...sheet.querySelectorAll<HTMLElement>(".map *")]
      .filter((e) => e.offsetParent && e.getBoundingClientRect().width > 0)
      .filter((e) => !e.closest(".ph-carousel, .ph-chips, .ph-swipe-row"))
      .filter((e) => { const r = e.getBoundingClientRect(); return r.right > s.right + 1 || r.left < s.left - 1; })
      .map((e) => e.textContent?.trim().slice(0, 12) || e.className);
  });
const insideSheet = async (page: Page, id: string) => {
  const r = (await page.locator(`.sheet [data-part=${id}]`).boundingBox())!;
  const s = (await page.locator(".sheet").boundingBox())!;
  return r.x >= s.x - 1 && r.y >= s.y - 1 && r.x + r.width <= s.x + s.width + 1 && r.y + r.height <= s.y + s.height + 1;
};

test.describe("図面", () => {
  test("引き出し線の名前を押すと、その部品の説明が出る", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".drawing.is-wide")).toBeVisible();
    await page.waitForTimeout(300);
    await shot(page, "pc-top");
    const n = await page.locator(".callout").count();
    expect(n).toBe(await page.locator(".sheet [data-part]").evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 0).length));
    await page.locator(".callout", { hasText: "タブバー" }).click();
    await expect(entryName(page)).toHaveText("タブバー");
    await expect(page).toHaveURL(/\/parts\/tab-bar\//);
    // 部品名は図面の上の見出しの1か所だけで、右の欄には出さない
    await expect(page.locator(".split-main > .intro.is-part")).toContainText("タブバー");
    await expect(page.locator(".side .entry-title")).toBeHidden();
    const mark = await page.locator(".sheet [data-part=tab-bar]").evaluate((el) => getComputedStyle(el, "::after"));
    expect(mark.mixBlendMode).toBe("multiply");
    expect(mark.backgroundImage).toContain("linear-gradient");
    expect(mark.boxShadow).toBe("none");
    await expect(page.locator("h1")).toHaveText(/^タブバー/);
  });

  test("よくあるノートPCの幅（1280px）でも引き出し線が出る", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.locator(".drawing.is-wide")).toBeVisible();
    for (const id of await page.locator(".sheet [data-part]").evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent).map((e) => (e as HTMLElement).dataset.part!))) {
      expect(await insideSheet(page, id), `${id} が見本の画面からはみ出す`).toBe(true);
    }
    expect(await overflowing(page), "見本の画面からはみ出す物").toEqual([]);
    await page.locator(".callout", { hasText: "スナックバー" }).click();
    await expect(entryName(page)).toHaveText("スナックバー");
    await expect(entryName(page)).toBeInViewport();
  });

  test("FAB とスナックバーは、タブバーやほかの部品に重ならずに画面の中に浮く", async ({ page }) => {
    await page.goto("/");
    for (const [a, b] of [["snackbar", "tab-bar"], ["fab", "tab-bar"], ["fab", "snackbar"], ["fab", "swipe-action"]] as const) {
      expect(await overlap(page, a, b), `${a} が ${b} に重なる`).toBe(false);
    }
    for (const id of ["snackbar", "fab", "home-indicator", "dynamic-island"]) {
      expect(await insideSheet(page, id)).toBe(true);
      expect(await page.locator(`.sheet [data-part=${id}]`).evaluate((el) => getComputedStyle(el).position)).toBe("absolute");
    }
    if (SHOT) await page.locator(".sheet").screenshot({ path: `${SHOT}/pc-sheet.png` });
  });

  test("入れ子の部品を別々に引ける（カードとカルーセル、戻るボタンとナビゲーションバー）", async ({ page }) => {
    await page.goto("/");
    await page.locator(".sheet .ph-card").first().click();
    await expect(entryName(page)).toHaveText("カード");
    await page.locator(".sheet .ph-carousel-item").nth(1).click();
    await expect(entryName(page)).toHaveText("カルーセル");
    await page.locator(".sheet .ph-dots button").first().click();
    await expect(entryName(page)).toHaveText("ページコントロール");
    await page.locator(".sheet .ph-back").click();
    await expect(entryName(page)).toHaveText("戻るボタン");
    await page.locator(".sheet [data-part=nav-bar]").click({ position: { x: 180, y: 20 } });
    await expect(entryName(page)).toHaveText("ナビゲーションバー");
    await page.locator(".sheet [data-part=disclosure]").click();
    await expect(entryName(page)).toHaveText("ディスクロージャーインジケーター");
    // 下に固定した帯に隠れないよう、画面の真ん中まで動かしてから押す
    await page.locator(".sheet [data-part=list-cell]").evaluate((e) => e.scrollIntoView({ block: "center" }));
    await page.locator(".sheet [data-part=list-cell] .ph-cell-t").click();
    await expect(entryName(page)).toHaveText("リストのセル");
  });

  test("見本の画面に部品の見た目が効いている", async ({ page }) => {
    await page.goto("/");
    // 変数が流れていないと色が抜ける
    expect(await page.locator(".sheet .ph-chip.is-on").first().evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(37, 99, 235)");
    expect(await page.locator(".sheet .ph-card").first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe("14px");
    // 右上のお知らせは右端にある（題の場所に寄らない）
    const bell = (await page.locator(".sheet [data-part=badge]").boundingBox())!;
    const sh = (await page.locator(".sheet").boundingBox())!;
    expect(bell.x).toBeGreaterThan(sh.x + sh.width * 0.75);
  });

  test("部品に乗せると、対応する名前と線が光る", async ({ page }) => {
    await page.goto("/");
    await page.locator(".sheet .ph-badge").hover();
    await expect(page.locator(".callout.hot", { hasText: "バッジ" })).toBeVisible();
  });

  test("名前どうしが重ならず、画面からはみ出さない", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(300);
    const boxes = await page.locator(".callout").evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, s: e.textContent }; }));
    const vw = page.viewportSize()!.width;
    for (const b of boxes) {
      expect(b.l, `${b.s} が左にはみ出す`).toBeGreaterThanOrEqual(0);
      expect(b.r, `${b.s} が右にはみ出す`).toBeLessThanOrEqual(vw);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], c = boxes[j];
        const hit = a.l < c.r && c.l < a.r && a.t < c.b && c.t < a.b;
        expect(hit, `${a.s} と ${c.s} が重なる`).toBe(false);
      }
  });
});

test("一覧から窓の部品を開くと、見本と頼み方の例と、Web版へのリンクが出る", async ({ page }) => {
  await page.goto("/");
  await card(page, "ボトムシート").click();
  await expect(entryName(page)).toHaveText("ボトムシート");
  await expect(page.locator(".entry-preview .ph-sheet").first()).toBeVisible();
  await expect(page.locator(".ask:visible")).toContainText("ボトムシートを画面の半分まで出して");
  await expect(page.locator(".entry-confuse").first()).toContainText("アクションシート");
  await expect(page.locator(".entry-sister:visible")).toHaveAttribute("href", `${SISTER}parts/bottom-sheet/`);
});

test("名前を選んでAIに渡す文にする", async ({ page }) => {
  await page.goto("/?part=bottom-sheet");
  await expect(page.locator(".dock-go")).toBeDisabled();
  await page.getByRole("button", { name: "AIに渡す名前に入れる" }).click();
  await closeEntry(page);
  await card(page, "スナックバー").click();
  await page.getByRole("button", { name: "AIに渡す名前に入れる" }).click();
  await expect(page.locator(".dock-chip")).toHaveCount(2);
  await expect(page).toHaveURL(/pick=bottom-sheet,snackbar/);
  await closeEntry(page);
  await page.getByRole("button", { name: "AIに渡す文を見る" }).click();
  const text = page.locator(".ps-text");
  await expect(text).toContainText("アプリ部品図鑑で調べたアプリの部品の名前です");
  await expect(text).toContainText("1. ボトムシート（Bottom sheet）");
  await expect(text).toContainText("2. スナックバー（Snackbar）");
  await expect(text).toContainText("頼み方の例:");
  await expect(text).toContainText("?pick=bottom-sheet,snackbar");
});

test("PC幅：説明は右の列にずっと出ていて、押しても右の列だけが変わる", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".side")).toBeVisible();
  await expect(page.locator(".side-lead")).toContainText("ここに説明が出ます");
  await expect(page.locator(".drawer")).toHaveCount(0);
  const sk = card(page, "スケルトン");
  await sk.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  expect(before).toBeGreaterThan(800);
  await sk.click();
  await expect(entryName(page)).toHaveText("スケルトン");
  await expect(page.locator(".drawer-backdrop")).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(page.locator(".side")).toBeInViewport();
  await page.getByRole("button", { name: "次の部品" }).click();
  await expect(entryName(page)).toHaveText("エンプティステート");
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  await expect(page.locator(".side")).toBeInViewport();
  await expect(entryName(page)).toBeInViewport();
});

test("狭い幅：説明は重ねて開き、閉じてもページの位置が変わらない", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/");
  await expect(page.locator(".side")).toBeHidden();
  const sk = card(page, "スケルトン");
  await sk.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await sk.click();
  await expect(entryName(page)).toHaveText("スケルトン");
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await page.getByRole("button", { name: "次の部品" }).click();
  await expect(entryName(page)).toHaveText("エンプティステート");
  await page.getByRole("button", { name: "閉じる", exact: true }).click();
  await expect(page.locator(".drawer")).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await sk.click();
  await page.locator(".drawer-backdrop").click({ position: { x: 20, y: 300 } });
  await expect(page.locator(".drawer")).toHaveCount(0);
  await sk.click();
  await closeEntry(page);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await expect(page).not.toHaveURL(/\/parts\//);
});

test("共有リンクを開くと同じ選択になる", async ({ page }) => {
  await page.goto("/?pick=bottom-sheet,snackbar&part=alert");
  await expect(entryName(page)).toHaveText("アラート");
  await expect(page.locator(".dock-chip")).toHaveCount(2);
});

test("ことばで探せる", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("部品を探す").fill("下から");
  await expect(card(page, "ボトムシート")).toBeVisible();
  await expect(card(page, "ナビゲーションバー")).toHaveCount(0);
  await page.getByLabel("部品を探す").fill("zzz");
  await expect(page.locator(".none")).toBeVisible();
});

test("全部の部品の見本がエラーなく出る", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  const cards = page.locator(".name-card");
  const n = await cards.count();
  expect(n).toBe(58);
  const empty = await page.locator(".thumb-in").evaluateAll((els) => els.filter((e) => ((e.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0) < 10).length);
  expect(empty, "小さな見本が空のカード").toBe(0);
  const cut = await page.locator(".thumb").evaluateAll((els) => els.filter((t) => { const a = t.getBoundingClientRect(), b = t.querySelector(".thumb-in")!.getBoundingClientRect(); return b.left < a.left - 2 || b.right > a.right + 2; }).length);
  expect(cut, "見本の左右が切れるカード").toBe(0);
  await cards.first().click();
  for (let i = 0; i < n; i++) {
    if (i > 0) await page.getByRole("button", { name: "次の部品" }).click();
    await expect(page.locator(".dh-count")).toHaveText(`${i + 1} / ${n}`);
    const name = (await entryName(page).textContent()) ?? "";
    const h = await page.locator(".entry-preview").evaluate((el) => (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0);
    expect(h, `${name} の見本が空`).toBeGreaterThan(10);
  }
  expect(errors).toEqual([]);
});

// スマホ幅。名前の札は部品に重ねず、押した部品のそばに吹き出しで名前を出す（UI部品図鑑と同じ形）
test("スマホ幅：押すとそばに吹き出しで名前が出て、上の帯も横にはみ出さない @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".drawing.is-narrow")).toBeVisible();
  await expect(page.locator(".map-hint")).toHaveText("部品をタップすれば、名前がでます");
  expect(await page.locator(".sheet [data-part=chip]").evaluate((e) => getComputedStyle(e, "::after").borderTopStyle)).not.toBe("dashed");
  const sheetTop = async () => (await page.locator(".sheet").boundingBox())!.y + (await page.evaluate(() => scrollY));
  await expect(page.locator(".dock")).toBeHidden();
  const cut = await page.locator(".thumb").evaluateAll((els) => els.filter((t) => { const a = t.getBoundingClientRect(), b = t.querySelector(".thumb-in")!.getBoundingClientRect(); return b.left < a.left - 2 || b.right > a.right + 2; }).length);
  expect(cut, "見本の左右が切れるカード").toBe(0);
  expect(await overflowing(page), "見本の画面からはみ出す物").toEqual([]);
  for (const [a, b] of [["snackbar", "tab-bar"], ["fab", "tab-bar"], ["fab", "snackbar"], ["fab", "swipe-action"]] as const) {
    expect(await overlap(page, a, b), `${a} が ${b} に重なる`).toBe(false);
  }
  // 上の帯：名前・図鑑の切り替え・3つのリンクが1行の高さに収まり、折り返さない
  const top = (await page.getByRole("banner").boundingBox())!;
  expect(top.height).toBeLessThanOrEqual(64);
  for (const l of await page.locator(".top-links a").all()) expect((await l.boundingBox())!.height).toBeLessThan(26);
  await expect(page.getByRole("navigation", { name: "図鑑の切り替え" }).getByRole("link", { name: "Web" })).toBeVisible();
  await shot(page, "sp-top");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);

  const bubbleFits = async (id: string) => {
    const b = (await page.locator(".map-bubble").boundingBox())!;
    const r = (await page.locator(`.sheet [data-part=${id}]`).boundingBox())!;
    const vw = page.viewportSize()!.width;
    expect(b.x, "吹き出しが左で切れる").toBeGreaterThanOrEqual(0);
    expect(b.x + b.width, "吹き出しが右で切れる").toBeLessThanOrEqual(vw);
    expect(b.y + b.height <= r.y + 1 || b.y >= r.y + r.height - 1, `吹き出しが${id}に重なる`).toBe(true);
  };
  const top0 = await sheetTop();
  for (const [id, name] of [["segmented", "セグメンテッドコントロール"], ["nav-bar", "ナビゲーションバー"], ["disclosure", "ディスクロージャーインジケーター"], ["tab-bar", "タブバー"]] as const) {
    await page.locator(`.sheet [data-part=${id}]`).scrollIntoViewIfNeeded();
    const y = await page.evaluate(() => scrollY);
    await page.locator(`.sheet [data-part=${id}]`).click({ position: { x: 4, y: 4 } });
    await expect(page.locator(".map-bubble .mb-name b")).toHaveText(name);
    await expect(page.locator(".drawer")).toHaveCount(0);
    await expect(page.locator(".map-bubble")).toBeInViewport();
    expect(await page.evaluate(() => scrollY)).toBe(y);
    await bubbleFits(id);
    await expect(page.locator(".intro h1")).toContainText("なんて呼ぶ");
    expect(await sheetTop()).toBe(top0);
    if (id === "segmented") await shot(page, "sp-bubble");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);

  await page.locator(".mb-pick").click();
  await expect(page.locator(".mb-pick")).toHaveText("入れました");
  await expect(page.locator(".dock")).toBeVisible();
  await expect(page.locator(".dock-go")).toHaveText("AIに渡す文を見る（1件）");
  await page.locator(".intro h1").click();
  await expect(page.locator(".map-bubble")).toHaveCount(0);

  // 「詳しく」で画面全体に説明が開き、ブラウザの「戻る」で吹き出しに戻る
  await page.locator(".sheet [data-part=search-bar]").click({ position: { x: 4, y: 4 } });
  const y0 = await page.evaluate(() => scrollY);
  await page.locator(".mb-more").click();
  await expect(entryName(page)).toHaveText("検索バー");
  await page.waitForTimeout(800);
  const dr = (await page.locator(".drawer").boundingBox())!;
  expect(dr.y).toBe(0);
  expect(dr.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 1);
  await shot(page, "sp-entry");
  await page.goBack();
  await expect(page.locator(".drawer")).toHaveCount(0);
  await expect(page.locator(".map-bubble .mb-name b")).toHaveText("検索バー");
  expect(await page.evaluate(() => scrollY)).toBe(y0);
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-bubble")).toHaveCount(0);

  await card(page, "ボトムシート").scrollIntoViewIfNeeded();
  const y1 = await page.evaluate(() => scrollY);
  await card(page, "ボトムシート").click();
  await expect(entryName(page)).toHaveText("ボトムシート");
  await page.goBack();
  await expect(page.locator(".drawer")).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(y1);
});

test("広いPC幅：目次から図面に無い部品も開ける", async ({ page }) => {
  await page.goto("/");
  const toc = page.getByRole("navigation", { name: "部品の目次" });
  await expect(toc).toBeVisible();
  await expect(toc.getByRole("button", { expanded: true })).toHaveCount(0);
  await toc.getByRole("button", { name: /^画面の骨組み/ }).click();
  await expect(toc.getByRole("button", { name: "ナビゲーションバー", exact: true })).toBeVisible();
  const y = await page.evaluate(() => scrollY);
  await toc.getByRole("button", { name: /^重なって出る窓/ }).click();
  await expect(toc.getByRole("button", { name: "ナビゲーションバー", exact: true })).toHaveCount(0);
  await expect(toc.getByRole("button", { expanded: true })).toHaveCount(1);
  await toc.getByRole("button", { name: "ボトムシート", exact: true }).click();
  await expect(entryName(page)).toHaveText("ボトムシート");
  expect(await page.evaluate(() => scrollY)).toBe(y);
  // 図面にある部品を目次で選ぶと、図面のその部品が見えるところまでページが動く
  await toc.getByRole("button", { name: /^画面の骨組み/ }).click();
  await toc.getByRole("button", { name: "ホームインジケーター", exact: true }).click();
  await expect(entryName(page)).toHaveText("ホームインジケーター");
  await expect.poll(async () => {
    const r = (await page.locator('.sheet [data-part="home-indicator"]').boundingBox())!;
    const vh = page.viewportSize()!.height - 72;
    return r.y >= 64 && r.y + r.height <= vh;
  }).toBe(true);
  await page.locator(".callout", { hasText: "バッジ" }).click();
  await expect(toc.getByRole("button", { name: /^状態を伝える/ })).toHaveAttribute("aria-expanded", "true");
  await expect(toc.getByRole("button", { expanded: true })).toHaveCount(1);
  await expect(page.locator(".drawing.is-wide")).toBeVisible();
});

test("1280px：目次は出さず、図面に引き出し線を書く", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "部品の目次" })).toBeHidden();
  await expect(page.locator(".drawing.is-wide")).toBeVisible();
});

test("部品のページは、その部品の名前が h1 で、説明が開いた状態で書き出されている", async ({ page, request }) => {
  const html = await (await request.get("/parts/list-cell/")).text();
  expect(html).toMatch(/<h1><span class="intro-name">リストのセル<\/span>/);
  expect(html).toContain("<title>リストのセル（List cell）とは？");
  expect(html).toMatch(/<link rel="canonical" href="[^"]*\/parts\/list-cell\/"/);
  expect(html).toContain('"@type":"DefinedTerm"');
  await page.goto("/parts/list-cell/");
  await expect(page.locator("h1")).toHaveText(/^リストのセル/);
  await page.locator(".crumbs a").click();
  await expect(page.locator("h1")).toHaveText("そのアプリの部品、なんて呼ぶ？");
  await expect(page).not.toHaveURL(/\/parts\//);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g)?.length).toBe(3 + (await page.locator("#names .name-card").count()));
  expect(sitemap).toContain("/how-to/</loc>");
  expect(sitemap).toContain("/confusions/</loc>");
});

// 共有画像・アイコン（2026-10-20）。部品ごとの共有画像があり、トップにも favicon.ico の指定がある
test("部品ごとの共有画像・favicon・manifest が出ている", async ({ page, request }) => {
  const html = await (await request.get("/parts/tab-bar/")).text();
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/og\/tab-bar\.png"/);
  expect(html).toMatch(/<meta name="twitter:image" content="[^"]*\/og\/tab-bar\.png"/);
  // 一覧にある全部品に共有画像がある
  await page.goto("/");
  const ids = await page.locator("#names .name-card .nc-open").evaluateAll((els) => els.map((e) => e.getAttribute("href")!.match(/parts\/([^/]+)\//)![1]));
  expect(ids.length).toBe(58);
  for (const id of ids) {
    const r = await request.get(`/og/${id}.png`);
    expect(r.status(), `${id} の共有画像`).toBe(200);
    expect(r.headers()["content-type"]).toContain("image/png");
  }
  const top = await (await request.get("/")).text();
  expect(top).toMatch(/<link rel="icon" href="[^"]*\/favicon\.ico"/);
  expect(top).toMatch(/<link rel="manifest" href="[^"]*\/manifest\.webmanifest"/);
  const mf = await (await request.get("/manifest.webmanifest")).json();
  expect(mf.name).toBe("アプリ部品図鑑");
  for (const ic of mf.icons) expect((await request.get(ic.src)).status()).toBe(200);
});

test("全体図に無い部品は真ん中を単体表示にし、全体図へ戻れる", async ({ page }) => {
  await page.goto("/");
  const toc = page.getByRole("navigation", { name: "部品の目次" });
  await toc.getByRole("button", { name: /^画面の骨組み/ }).click();
  await toc.getByRole("button", { name: "ツールバー", exact: true }).click();
  await expect(page.locator(".focus-name")).toHaveText(/^ツールバー/);
  await expect(page.locator(".focus-stage > *").first()).toBeInViewport();
  const more = page.getByRole("region", { name: "画面の骨組みのほかの部品" });
  await expect(more.locator(".name-card").first()).toBeVisible();
  await more.getByRole("link", { name: "セーフエリアの説明を開く" }).click();
  await expect(page.locator(".focus-name")).toHaveText(/^セーフエリア/);
  await toc.getByRole("button", { name: "ツールバー", exact: true }).click();
  await expect(page.locator(".drawing")).toHaveCount(0);
  await page.getByRole("button", { name: "画面の全体図に戻る" }).click();
  await expect(page.locator(".drawing.is-wide")).toBeVisible();
  await expect(entryName(page)).toHaveText("ツールバー");
  await page.locator(".callout", { hasText: "バッジ" }).click();
  await expect(page.locator(".drawing")).toBeVisible();
  await toc.getByRole("button", { name: /^重なって出る窓/ }).click();
  await toc.getByRole("button", { name: "ボトムシート", exact: true }).click();
  await expect(page.locator(".focus-name")).toHaveText(/^ボトムシート/);
});

test("見分け方は別ページにあり、部品のページへ進める", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "見分け方", exact: true }).click();
  await expect(page).toHaveURL(/\/confusions\/$/);
  await expect(page.locator("h1")).toHaveText("まぎらわしい名前の見分け方");
  await expect(page.locator(".confuse-row").first()).toContainText("アラートとアクションシート");
  await page.locator(".confuse-row").first().getByRole("link", { name: /^アクションシート/ }).click();
  await expect(page).toHaveURL(/\/parts\/action-sheet\/$/);
  await expect(page.locator("h1")).toHaveText(/^アクションシート/);
});

test("AIへの渡し方は別ページにあり、3つの方法と一覧のリンクが出る", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "AIへの渡し方" }).click();
  await expect(page).toHaveURL(/\/how-to\/$/);
  await expect(page.locator("h1")).toHaveText("AIへの渡し方");
  await expect(page.locator(".how-row h2")).toHaveText(["名前を入れて頼む", "選んだ名前をまとめて渡す", "名前の一覧ごと読ませる"]);
  const href = await page.getByRole("link", { name: "llms.txt" }).getAttribute("href");
  const llms = await (await request.get(href!)).text();
  expect(llms).toContain("# アプリ部品図鑑");
  expect(llms).toContain("ui-parts-zukan/llms.txt");
});

// 姉妹サイト（UI部品図鑑）への入口。上の帯の切り替え・トップの入口・各ページのフッター・部品の説明から行ける
test("UI部品図鑑（Web版）へ、上の帯・トップ・フッター・部品の説明から移れる", async ({ page }) => {
  for (const path of ["/", "/confusions/", "/how-to/", "/parts/tab-bar/"]) {
    await page.goto(path);
    const sw = page.getByRole("navigation", { name: "図鑑の切り替え" });
    await expect(sw.getByRole("link", { name: "Web" })).toHaveAttribute("href", SISTER);
    await expect(sw.locator("[aria-current=page]")).toHaveText("アプリ");
    await expect(page.locator(".sister-credit a")).toHaveAttribute("href", SISTER);
  }
  await page.goto("/");
  await expect(page.locator(".read-links a")).toHaveCount(3);
  await expect(page.locator(".confuse-link.is-sister")).toHaveAttribute("href", SISTER);
  // Web版に同じ部品がある物だけ、説明から Web版の部品のページへ
  await page.goto("/parts/tab-bar/");
  await expect(page.locator(".entry-sister:visible")).toHaveAttribute("href", `${SISTER}parts/bottom-nav/`);
  await page.goto("/parts/swipe-action/");
  await expect(page.locator(".entry-sister")).toHaveCount(0);
});

// 閲覧数（Vercel Web Analytics）は replaceState を数えないので、部品のページに移ったときだけ自分で1回送る
test("部品を選んでURLが変わると、閲覧数を1回送る", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { va: (...a: unknown[]) => void; vaCalls: unknown[][] };
    w.vaCalls = [];
    w.va = (...a) => w.vaCalls.push(a);
  });
  await page.goto("/");
  const calls = () => page.evaluate(() => (window as unknown as { vaCalls: [string, { path: string }][] }).vaCalls);
  expect(await calls()).toEqual([]);
  await page.locator(".callout", { hasText: "タブバー" }).click();
  await expect.poll(calls).toEqual([["pageview", { path: "/parts/tab-bar/" }]]);
  // 同じ部品のまま、AIに渡す名前を足しても（URLのクエリだけ変わる）数えない
  await page.getByRole("button", { name: "AIに渡す名前に入れる" }).click();
  await page.waitForTimeout(200);
  expect((await calls()).length).toBe(1);
  await page.locator(".callout", { hasText: "バッジ" }).click();
  await expect.poll(async () => (await calls()).length).toBe(2);
});

test("上の帯はスクロールしても画面上部に残る", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.getByRole("banner")).toBeInViewport();
  const r = (await page.getByRole("banner").boundingBox())!;
  expect(Math.round(r.y)).toBe(0);
  const side = (await page.locator(".side").boundingBox())!;
  expect(side.y).toBeGreaterThanOrEqual(r.height);
});

test("PC幅：見出しは図面の上に1か所で、選んでも図面が動かず、スクロールしても付いてくる", async ({ page }) => {
  await page.goto("/");
  const boardTop = () => page.evaluate(() => Math.round(document.querySelector(".board")!.getBoundingClientRect().top + scrollY));
  const before = await boardTop();
  await page.locator(".callout", { hasText: "チップ" }).click();
  await expect(entryName(page)).toHaveText("チップ");
  expect(await boardTop()).toBe(before);
  const toc = (await page.getByRole("navigation", { name: "部品の目次" }).boundingBox())!;
  const head = (await page.locator(".split-main > .intro").boundingBox())!;
  expect(toc.y).toBeLessThanOrEqual(head.y + 1);
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(page.locator(".split-main > .intro.is-part")).toBeInViewport();
});
