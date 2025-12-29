import os
from PIL import Image

BASE_DIR = "dataset/mask"
splits = ["train", "val"]
classes = ["with_mask", "without_mask"]

removed = 0
skipped = 0

for split in splits:
    for cls in classes:
        folder = os.path.join(BASE_DIR, split, cls)
        if not os.path.exists(folder):
            continue

        for file in os.listdir(folder):
            path = os.path.join(folder, file)

            if not os.path.isfile(path):
                skipped += 1
                continue

            try:
                with Image.open(path) as img:
                    img.verify()
            except:
                try:
                    os.remove(path)
                    removed += 1
                except:
                    skipped += 1

print("✅ Mask dataset cleaned")
print(f"🗑️ Removed broken images: {removed}")
print(f"⚠️ Skipped entries: {skipped}")
