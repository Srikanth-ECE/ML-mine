import os
from PIL import Image

BASE_DIR = "dataset/vest"
splits = ["train", "val"]
classes = ["with_vest", "without_vest"]

removed = 0
skipped = 0

for split in splits:
    for cls in classes:
        folder = os.path.join(BASE_DIR, split, cls)
        if not os.path.exists(folder):
            continue

        for file in os.listdir(folder):
            path = os.path.join(folder, file)

            # Skip if path is invalid
            if not os.path.isfile(path):
                skipped += 1
                continue

            # Try opening image
            try:
                with Image.open(path) as img:
                    img.verify()   # verifies image integrity
            except:
                try:
                    os.remove(path)
                    removed += 1
                except:
                    skipped += 1

print(f"✅ Vest dataset cleanup completed")
print(f"🗑️ Removed broken images: {removed}")
print(f"⚠️ Skipped invalid entries: {skipped}")
