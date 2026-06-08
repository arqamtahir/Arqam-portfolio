#!/usr/bin/env python3
"""Compose a LinkedIn banner (1584x396) from the portfolio's brand + assets.

Rendered at 3x supersampling for crisp display on LinkedIn.
"""
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import os

S = 3  # supersample factor — triples the output resolution
W, H = 1584 * S, 396 * S
ACCENT = (88, 140, 255)
ACCENT_DK = (54, 92, 200)
BG0 = (18, 18, 24)
BG1 = (12, 12, 16)
SURFACE = (30, 30, 40)
FG = (244, 244, 248)
MUTED = (156, 158, 172)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "public", "images")

# ---- fonts ----
def font(path, size):
    return ImageFont.truetype(path, size * S)

BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
f_eyebrow = font(BOLD, 19)
f_h1 = font(BOLD, 47)
f_sub = font(REG, 23)
f_pill = font(BOLD, 19)
f_brand = font(BOLD, 18)
f_url = font(BOLD, 17)

# ---- base gradient ----
base = Image.new("RGB", (W, H), BG0)
grad = Image.new("L", (1, H))
for y in range(H):
    grad.putpixel((0, y), int(255 * y / H))
grad = grad.resize((W, H))
base = Image.composite(Image.new("RGB", (W, H), BG1), base, grad)

# accent glow top-right
glow = Image.new("RGB", (W, H), BG0)
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 760 * S, -360 * S, W + 200 * S, 360 * S], fill=ACCENT_DK)
glow = glow.filter(ImageFilter.GaussianBlur(180 * S))
base = Image.blend(base, glow, 0.35)

draw = ImageDraw.Draw(base)

def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0], img.size[1]], radius, fill=255)
    img.putalpha(mask)
    return img

# ---- LEFT: angled screenshot collage (decorative; sits under the avatar zone) ----
def card(path, w):
    im = Image.open(path).convert("RGB")
    h = round(im.height * w / im.width)
    im = im.resize((w, h))
    im = ImageOps.expand(im, border=4 * S, fill=(235, 236, 240))
    return rounded(im.convert("RGBA"), 14 * S)

c1 = card(os.path.join(IMG, "projects", "staywithlumina.png"), 300 * S).rotate(8, expand=True, resample=Image.BICUBIC)
c2 = card(os.path.join(IMG, "projects", "nice2stay.png"), 320 * S).rotate(8, expand=True, resample=Image.BICUBIC)
base.paste(c1, (-30 * S, 60 * S), c1)
base.paste(c2, (150 * S, 95 * S), c2)

# soft fade so collage melts into the bg on its right edge
fade = Image.new("L", (260, H), 0)
for x in range(260):
    fade.putpixel((x, 0), int(255 * (x / 260)))
fade = fade.resize((260 * S, H))
veil = Image.new("RGB", (260 * S, H), BG0)
base.paste(veil, (480 * S, 0), fade)

# ---- RIGHT: accent panel + portrait ----
panel = Image.new("RGBA", (470 * S, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(panel)
for x in range(470 * S):
    a = int(150 * (x / (470 * S)))
    pd.line([(x, 0), (x, H)], fill=(*ACCENT_DK, a))
base.paste(panel, (W - 470 * S, 0), panel)

# ---- CENTER: text ----
x = 540 * S
# eyebrow
draw.text((x, 60 * S), "ARQAM TAHIR", font=f_eyebrow, fill=ACCENT)
ew = draw.textlength("ARQAM TAHIR", font=f_eyebrow)
draw.text((x + ew + 14 * S, 60 * S), "· SENIOR SOFTWARE ENGINEER", font=f_eyebrow, fill=MUTED)

# headline (two lines, accent phrase)
y = 96 * S
draw.text((x, y), "I build high-performance", font=f_h1, fill=FG)
y += 54 * S
pre = "web products that "
draw.text((x, y), pre, font=f_h1, fill=FG)
pw2 = draw.textlength(pre, font=f_h1)
draw.text((x + pw2, y), "rank & convert.", font=f_h1, fill=ACCENT)

# subhead
y += 70 * S
draw.text((x, y), "Next.js  ·  Nuxt.js  ·  React  ·  Vue.js  ·  TypeScript  ·  Node.js",
          font=f_sub, fill=MUTED)

# pills
y += 56 * S
def pill(px, text):
    tw = draw.textlength(text, font=f_pill)
    w = int(tw + 36 * S)
    chip = Image.new("RGBA", (w, 40 * S), (0, 0, 0, 0))
    cd = ImageDraw.Draw(chip)
    cd.rounded_rectangle([0, 0, w - 1, 40 * S - 1], 20 * S, fill=(255, 255, 255, 18),
                         outline=(255, 255, 255, 55), width=S)
    base.paste(chip, (px, y), chip)
    draw.text((px + 18 * S, y + 9 * S), text, font=f_pill, fill=FG)
    return px + w + 12 * S
nx = pill(x, "Planning")
nx = pill(nx, "Build & Launch")
nx = pill(nx, "Ongoing optimization")

# brands chip
y += 64 * S
brands = "Nice2Stay · StayWithLumina · Hotel Weekend"
bw = draw.textlength(brands, font=f_brand) + 36 * S
bchip = Image.new("RGBA", (int(bw), 44 * S), (0, 0, 0, 0))
ImageDraw.Draw(bchip).rounded_rectangle([0, 0, int(bw) - 1, 44 * S - 1], 14 * S,
                                        fill=(*SURFACE, 255), outline=(255, 255, 255, 30), width=S)
base.paste(bchip, (x, y), bchip)
draw.text((x + 18 * S, y + 12 * S), brands, font=f_brand, fill=FG)

# url — to the right of the brands chip, vertically centered with it
uy = y + (44 * S - (f_url.getbbox("A")[3] - f_url.getbbox("A")[1])) // 2 - 4 * S
draw.text((x + int(bw) + 24 * S, uy), "arqamtahir.com", font=f_url, fill=ACCENT)

out = os.path.join(IMG, "linkedin-banner.png")
base.convert("RGB").save(out, optimize=True)
print("saved", out, base.size, f"{os.path.getsize(out)//1024} KB")
