import os
import sys
import re
import argparse
from pathlib import Path
from PIL import Image, ImageOps

# Supported image extensions
VALID_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp', '.gif', '.ico', '.heic', '.avif'}

def natural_sort_key(path):
    """Sort filenames naturally (e.g. 1.jpg, 2.jpg ... 10.jpg instead of 1, 10, 2)."""
    return [int(c) if c.isdigit() else c.lower() for c in re.split(r'(\d+)', path.name)]

def convert_images(keyword, input_dir, output_dir, quality=85, start_index=1, padding=1, separator="-"):
    """
    Converts images from input_dir to WebP format in output_dir,
    naming them sequentially with the provided keyword.
    1st image: keyword.webp
    2nd+ images: keyword-2.webp, keyword-3.webp, etc.
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)

    if not input_path.exists():
        print(f"Error: Input directory '{input_path.resolve()}' does not exist.")
        return

    output_path.mkdir(parents=True, exist_ok=True)

    # Collect all valid image files sorted by name
    image_files = [
        f for f in input_path.iterdir()
        if f.is_file() and f.suffix.lower() in VALID_EXTENSIONS
    ]

    # Sort files naturally (1.jpg, 2.jpg, ..., 10.jpg)
    image_files.sort(key=natural_sort_key)

    if not image_files:
        print(f"No supported images found in '{input_path.resolve()}'.")
        print(f"Supported formats: {', '.join(sorted(VALID_EXTENSIONS))}")
        return

    print(f"\n--- WebP Photo Converter ---")
    print(f"Input Directory  : {input_path.resolve()}")
    print(f"Output Directory : {output_path.resolve()}")
    print(f"Keyword          : {keyword}")
    print(f"Quality          : {quality}%")
    print(f"Total Images     : {len(image_files)}")
    print(f"-----------------------------\n")

    current_num = start_index
    success_count = 0
    total_orig_size = 0
    total_new_size = 0

    for idx, file_path in enumerate(image_files):
        try:
            # 1st image -> keyword.webp, 2nd+ images -> keyword-2.webp, keyword-3.webp, etc.
            if current_num == 1:
                out_filename = f"{keyword}.webp"
            else:
                seq_str = str(current_num).zfill(padding)
                out_filename = f"{keyword}{separator}{seq_str}.webp"
            out_filepath = output_path / out_filename

            orig_size = file_path.stat().st_size
            total_orig_size += orig_size

            with Image.open(file_path) as img:
                # Handle EXIF orientation
                try:
                    img = ImageOps.exif_transpose(img)
                except Exception:
                    pass

                # Convert mode for WebP saving (RGBA for transparent images, RGB for others)
                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")

                # Save as WebP
                img.save(out_filepath, "WEBP", quality=quality, method=6)

            new_size = out_filepath.stat().st_size
            total_new_size += new_size
            savings = ((orig_size - new_size) / orig_size * 100) if orig_size > 0 else 0

            orig_size_kb = orig_size / 1024
            new_size_kb = new_size / 1024

            print(f"[{idx+1}/{len(image_files)}] {file_path.name} -> {out_filename} "
                  f"({orig_size_kb:.1f} KB -> {new_size_kb:.1f} KB, saved {savings:.1f}%)")

            current_num += 1
            success_count += 1

        except Exception as e:
            print(f"Error converting '{file_path.name}': {e}")

    print(f"\n==========================================")
    print(f"Successfully converted {success_count}/{len(image_files)} images!")
    if total_orig_size > 0:
        total_savings = ((total_orig_size - total_new_size) / total_orig_size * 100)
        print(f"Total size reduced from {total_orig_size/1024/1024:.2f} MB to {total_new_size/1024/1024:.2f} MB ({total_savings:.1f}% space saved)")
    print(f"All images saved in: {output_path.resolve()}")
    print(f"==========================================\n")

def main():
    parser = argparse.ArgumentParser(description="Convert images to WebP format with sequential keyword naming.")
    parser.add_argument("-k", "--keyword", type=str, help="Keyword for naming files (e.g. 'photo')")
    parser.add_argument("-i", "--input", type=str, default="all-imeges", help="Input directory containing images (default: all-imeges)")
    parser.add_argument("-o", "--output", type=str, default="webp", help="Output directory for WebP images (default: webp)")
    parser.add_argument("-q", "--quality", type=int, default=85, help="WebP quality (1-100, default: 85)")
    parser.add_argument("-s", "--start", type=int, default=1, help="Starting sequence number (default: 1)")
    parser.add_argument("-p", "--padding", type=int, default=1, help="Zero-padding length for sequence (e.g. 1 -> 1, 2 -> 01, 3 -> 001)")
    parser.add_argument("-sep", "--separator", type=str, default="-", help="Separator between keyword and sequence number (default: '-')")

    args = parser.parse_args()

    keyword = args.keyword
    if not keyword:
        print("--- WebP Photo Converter CLI ---")
        keyword = input("Enter keyword for naming images (e.g., 'photo', 'product', 'vacation'): ").strip()
        if not keyword:
            keyword = "image"
            print("No keyword provided. Using default keyword: 'image'")

        input_dir_input = input("Enter input folder path [default: 'all-imeges']: ").strip()
        input_dir = input_dir_input if input_dir_input else args.input

        output_dir_input = input("Enter output folder path [default: 'webp']: ").strip()
        output_dir = output_dir_input if output_dir_input else args.output
    else:
        input_dir = args.input
        output_dir = args.output

    convert_images(
        keyword=keyword,
        input_dir=input_dir,
        output_dir=output_dir,
        quality=args.quality,
        start_index=args.start,
        padding=args.padding,
        separator=args.separator
    )

if __name__ == "__main__":
    main()
