import cv2
import winsound
import time
import csv
import os
from datetime import datetime
from collections import defaultdict, deque
from ultralytics import YOLO

# ================= SETTINGS =================
CONF_THRESHOLD = 25
IOU_THRESHOLD = 0.05
VIOLATION_INTERVAL = 5
GRACE_PERIOD = 2

# ================= LOAD YOLO MODEL =================
model = YOLO("ppe_yolov8n.pt")

# Class IDs (from data.yaml)
HARDHAT = 0
MASK = 1
PERSON = 2
VEST = 3

# ================= IOU FUNCTION =================
def compute_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interW = max(0, xB - xA)
    interH = max(0, yB - yA)
    interArea = interW * interH
    if interArea == 0:
        return 0.0

    boxAArea = (boxA[2]-boxA[0]) * (boxA[3]-boxA[1])
    boxBArea = (boxB[2]-boxB[0]) * (boxB[3]-boxB[1])
    return interArea / float(boxAArea + boxBArea - interArea)

# ================= CSV =================
TODAY = datetime.now().strftime("%Y-%m-%d")
CSV_FILE = f"ppe_report_{TODAY}.csv"

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="") as f:
        csv.writer(f).writerow([
            "Time", "Person",
            "Helmet %", "Mask %", "Vest %",
            "Status", "Violation Duration (s)", "Severity"
        ])

# ================= MEMORY =================
violation_start_time = {}
last_violation_time = defaultdict(float)
last_status = {}

# ================= ANALYTICS =================
violation_stats = {"helmet": 0, "mask": 0, "vest": 0}

# ================= FPS =================
fps_buffer = deque(maxlen=10)
latency_buffer = deque(maxlen=10)

# ================= FOLDER =================
os.makedirs("violations", exist_ok=True)

# ================= CAMERA =================
cap = cv2.VideoCapture(0)

# ================= MAIN LOOP =================
while True:
    frame_start = time.time()
    ret, frame = cap.read()
    if not ret:
        break

    H, W, _ = frame.shape
    results = model(frame, conf=CONF_THRESHOLD/100, verbose=False)[0]

    persons = []
    items = []

    # ---------- SPLIT DETECTIONS ----------
    for box in results.boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        if cls == PERSON:
            persons.append((x1, y1, x2, y2))
        else:
            items.append((cls, x1, y1, x2, y2, conf))

    # ---------- PROCESS PERSONS ----------
    for i, (px1, py1, px2, py2) in enumerate(persons):
        pid = f"Person_{i+1}"
        person_box = (px1, py1, px2, py2)

        helmet_ok = mask_ok = vest_ok = False
        helmet_conf = mask_conf = vest_conf = 0

        for cls, x1, y1, x2, y2, conf in items:
            ppe_box = (x1, y1, x2, y2)
            if compute_iou(person_box, ppe_box) >= IOU_THRESHOLD:
                if cls == HARDHAT:
                    helmet_ok = True
                    helmet_conf = max(helmet_conf, int(conf*100))
                elif cls == MASK:
                    mask_ok = True
                    mask_conf = max(mask_conf, int(conf*100))
                elif cls == VEST:
                    vest_ok = True
                    vest_conf = max(vest_conf, int(conf*100))

        status = "PPE COMPLIANT" if helmet_ok and mask_ok and vest_ok else "PPE NOT COMPLIANT"

        now = time.time()
        if status == "PPE NOT COMPLIANT":
            violation_start_time.setdefault(pid, now)
            violation_duration = int(now - violation_start_time[pid])
        else:
            violation_duration = 0
            violation_start_time.pop(pid, None)

        if status == "PPE COMPLIANT":
            severity = "SAFE"
        elif violation_duration < 5:
            severity = "LOW"
        elif violation_duration < 10:
            severity = "MEDIUM"
        else:
            severity = "HIGH"

        if status == "PPE NOT COMPLIANT":
            if not helmet_ok: violation_stats["helmet"] += 1
            if not mask_ok: violation_stats["mask"] += 1
            if not vest_ok: violation_stats["vest"] += 1

        if status == "PPE NOT COMPLIANT" and violation_duration >= GRACE_PERIOD:
            if now - last_violation_time[pid] >= VIOLATION_INTERVAL:
                winsound.Beep(1000, 500)
                cv2.imwrite(
                    f"violations/{pid}_{severity}_{datetime.now().strftime('%H-%M-%S')}.jpg",
                    frame[py1:py2, px1:px2]
                )
                last_violation_time[pid] = now

        if last_status.get(pid) != status:
            with open(CSV_FILE, "a", newline="") as f:
                csv.writer(f).writerow([
                    datetime.now().strftime("%H:%M:%S"),
                    pid,
                    helmet_conf, mask_conf, vest_conf,
                    status, violation_duration, severity
                ])
            last_status[pid] = status

        color = (0,255,0) if status == "PPE COMPLIANT" else (0,0,255)
        cv2.rectangle(frame, (px1,py1), (px2,py2), color, 2)

        cv2.putText(frame,
                    f"H:{helmet_conf}% M:{mask_conf}% V:{vest_conf}%",
                    (px1, py1-30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,0), 2)

        cv2.putText(frame,
                    f"{status} | {severity}",
                    (px1, py1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # ---------- FPS ----------
    ft = time.time() - frame_start
    fps_buffer.append(1/ft if ft > 0 else 0)
    latency_buffer.append(ft * 1000)

    cv2.putText(frame, f"FPS {sum(fps_buffer)/len(fps_buffer):.1f}",
                (20, H-40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
    cv2.putText(frame, f"Latency {sum(latency_buffer)/len(latency_buffer):.0f} ms",
                (20, H-15), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

    # ---------- VIOLATION COUNTS (TOP-RIGHT, TRANSPARENT) ----------
    overlay = frame.copy()
    cv2.rectangle(overlay, (W-270, 10), (W-10, 100), (0,0,0), -1)
    frame = cv2.addWeighted(overlay, 0.4, frame, 0.6, 0)

    cv2.putText(frame, f"Helmet Vio: {violation_stats['helmet']}",
                (W-260, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
    cv2.putText(frame, f"Mask Vio: {violation_stats['mask']}",
                (W-260, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
    cv2.putText(frame, f"Vest Vio: {violation_stats['vest']}",
                (W-260, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)

    cv2.imshow("YOLO PPE Compliance System", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
