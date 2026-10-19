#!/usr/bin/env python3
# 部品ごとの共有画像（public/og/<id>.png、1200×630）を作る。
# 左に分類・部品名・英語名・ひとこと、右に scripts/capture-og.mjs で撮った見本（scripts/og-src/<id>.png）を置く。
# 実行: python3 scripts/build-og.py（部品の名前と意味は src/lib/parts.ts から読む）
import os
import re
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "scripts", "og-src")
OUT = os.path.join(ROOT, "public", "og")
W, H = 1200, 630
PAPER, INK, BP, Y = (246, 250, 248), (11, 58, 44), (19, 121, 91), (255, 216, 74)


def font(weight, size):
    return ImageFont.truetype(f"/System/Library/Fonts/ヒラギノ角ゴシック W{weight}.ttc", size)


MONO = "/System/Library/Fonts/Menlo.ttc"


# parts.ts から分類と部品を読む（TypeScript を実行せず、決まった書き方を正規表現で拾う）
def load():
    s = open(os.path.join(ROOT, "src", "lib", "parts.ts"), encoding="utf-8").read()
    cats = dict(re.findall(r'\{ id: "([a-z]+)", label: "([^"]+)"', s))
    parts = []
    for m in re.finditer(r'id: "([a-z-]+)", cat: "([a-z]+)", ja: "([^"]+)", en: "([^"]+)".*?meaning: "([^"]+)"', s, re.S):
        pid, cat, ja, en, meaning = m.groups()
        parts.append({"id": pid, "cat": cats[cat], "ja": ja, "en": en, "meaning": meaning})
    return parts


# 文字の種類（漢字・ひらがな・カタカナ・英数字）のまとまりで折り返す。句読点・閉じ括弧は前の語に付ける
def runs(text):
    def kind(c):
        if re.match(r"[一-鿿々]", c): return "k"
        if re.match(r"[぀-ゟ]", c): return "h"
        if re.match(r"[゠-ヿー]", c): return "t"
        if re.match(r"[A-Za-z0-9]", c): return "a"
        return "p"
    out = []
    for c in text:
        k = kind(c)
        if out and (k == out[-1][1] or k == "p" and c in "、。）」・"):
            out[-1][0] += c
        else:
            out.append([c, k])
    return [r[0] for r in out]


def wrap(d, text, f, width):
    lines, cur = [], ""
    for r in runs(text):
        if d.textlength(cur + r, font=f) <= width:
            cur += r
        elif not cur or d.textlength(r, font=f) > width:
            for c in r:
                if d.textlength(cur + c, font=f) > width and cur:
                    lines.append(cur); cur = ""
                cur += c
        else:
            lines.append(cur); cur = r
    if cur: lines.append(cur)
    return lines


def grid(d, x0, x1):
    for x in range(0, W, 24):
        if x0 <= x <= x1: d.line([(x, 0), (x, H)], fill=(19, 121, 91, 26 if x % 120 == 0 else 13))
    for y in range(0, H, 24):
        d.line([(x0, y), (x1, y)], fill=(19, 121, 91, 26 if y % 120 == 0 else 13))


def build(p):
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im, "RGBA")
    grid(d, 0, W)
    # 右：見本（スマホ）を枠に収める
    demo = Image.open(os.path.join(SRC, f"{p['id']}.png")).convert("RGBA")
    box_w, box_h = 470, 560
    s = min(box_w / demo.width, box_h / demo.height, 1.2)
    demo = demo.resize((int(demo.width * s), int(demo.height * s)), Image.LANCZOS)
    cx = 920
    im.paste(demo, (cx - demo.width // 2, (H - demo.height) // 2), demo)
    # 左：印と名前
    d.ellipse([56, 58, 68, 70], fill=Y)
    d.line([(62, 64), (74, 46), (88, 46)], fill=BP, width=3)
    d.text((100, 44), "アプリ部品図鑑", font=font(7, 22), fill=INK)
    # 分類（線だけの札）
    tf = font(6, 18)
    tw = d.textlength(p["cat"], font=tf)
    d.rounded_rectangle([60, 132, 60 + tw + 28, 166], radius=17, outline=BP, width=2)
    d.text((74, 137), p["cat"], font=tf, fill=BP)
    # 部品名：1行に収まる大きさにする（長いカタカナ語を途中で折らない）
    size = 76
    while d.textlength(p["ja"], font=font(8, size)) > 560 and size > 34: size -= 2
    nf = font(8, size)
    ny = 196
    d.text((58, ny), p["ja"], font=nf, fill=INK)
    ey = ny + int(size * 1.3)
    d.text((62, ey), p["en"], font=ImageFont.truetype(MONO, 22), fill=BP)
    # ひとこと（蛍光ペンを敷く）
    mf = font(7, 32)
    my = ey + 58
    for line in wrap(d, p["meaning"], mf, 560)[:3]:
        lw = d.textlength(line, font=mf)
        d.rectangle([58, my + 22, 62 + lw, my + 40], fill=Y)
        d.text((60, my), line, font=mf, fill=INK)
        my += 50
    d.text((60, 560), "意味・使いどころ・AIへの頼み方", font=font(4, 18), fill=BP)
    im.save(os.path.join(OUT, f"{p['id']}.png"), optimize=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    parts = load()
    for p in parts: build(p)
    print(f"書き出し: public/og/ {len(parts)} 件")


if __name__ == "__main__":
    main()
