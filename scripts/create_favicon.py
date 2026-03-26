from PIL import Image, ImageDraw


def round_crop(src_path: str, out_path: str, size: int) -> None:
    img = Image.open(src_path).convert("RGBA")

    # Crop to a centered square
    side = min(img.width, img.height)
    left = (img.width - side) // 2
    top = (img.height - side) // 2
    img = img.crop((left, top, left + side, top + side))

    # Make a circular alpha mask
    mask = Image.new("L", (side, side), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, side - 1, side - 1), fill=255)

    out = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)

    out = out.resize((size, size), Image.LANCZOS)
    out.save(out_path)


def main() -> None:
    src = "public/fusion-orb.png"
    round_crop(src, "public/favicon-32x32.png", 32)
    round_crop(src, "public/favicon-64x64.png", 64)
    round_crop(src, "public/apple-touch-icon.png", 180)


if __name__ == "__main__":
    main()

