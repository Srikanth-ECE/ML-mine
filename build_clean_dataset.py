import os
import shutil
from pathlib import Path

SRC = Path("dataset/vest")
DST = Path("dataset/vest_clean")

for split in ("train", "val"):
    for cls in ("with_vest", "without_vest"):
        src_dir = SRC / split / cls
        dst_dir = DST / split / cls
        dst_dir.mkdir(parents=True, exist_ok=True)
        if not src_dir.exists():
            continue
        for fname in os.listdir(src_dir):
            src_path = src_dir / fname
            dst_path = dst_dir / fname
            try:
                with open(src_path, "rb") as f:
                    f.read(4)
                shutil.copy2(src_path, dst_path)
            except Exception:
                # skip unreadable files
                continue

print(f"Built cleaned dataset at {DST}")
