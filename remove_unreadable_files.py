import os
import shutil

BASE = "dataset/vest"
BROKEN = os.path.join(BASE, "broken")
os.makedirs(BROKEN, exist_ok=True)

moved = 0
for root, dirs, files in os.walk(BASE):
    # skip the broken folder itself
    if os.path.abspath(root) == os.path.abspath(BROKEN):
        continue
    for fname in files:
        path = os.path.join(root, fname)
        try:
            with open(path, "rb") as f:
                f.read(4)
        except Exception:
            dst = os.path.join(BROKEN, fname)
            try:
                shutil.move(path, dst)
                moved += 1
            except Exception as e:
                print(f"Failed moving {path}: {e}")

print(f"Moved {moved} unreadable files to {BROKEN}")
