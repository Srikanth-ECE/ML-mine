import os

BASE = "dataset/vest"
count = 0
for root, dirs, files in os.walk(BASE):
    for fname in files:
        if len(fname) > 100:
            src = os.path.join(root, fname)
            ext = os.path.splitext(fname)[1]
            new_name = f"img_{count:06d}{ext}"
            dst = os.path.join(root, new_name)
            try:
                os.rename(src, dst)
                count += 1
            except Exception as e:
                print(f"Failed to rename {src}: {e}")

print(f"Renamed {count} long filenames in {BASE}")
