import winsound
import cv2
import tensorflow as tf
import numpy as np
import csv
import time
from datetime import datetime
import os
from collections import deque, Counter

# ================= SETTINGS =================
CONF_THRESHOLD = 75
FACE_CONF_THRESHOLD = 70
VIOLATION_INTERVAL = 5
SMOOTHING_FRAMES = 5

# ================= LOAD MODELS =================
helmet_model = tf.keras.models.load_model("helmet_model.h5")
mask_model   = tf.keras.models.load_model("mask_model.h5")
vest_model   = tf.keras.models.load_model("vest_model.h5")
face_model   = tf.keras.models.load_model("face_model.h5")

helmet_classes = ["with_helmet", "without_helmet"]
mask_classes   = ["with_mask", "without_mask"]
vest_classes   = ["with_vest", "without_vest"]

face_names = ["Santhosh", "Srikanth"]

# ================= FACE DETECTOR =================
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

# ================= CSV =================
CSV_FILE = "ppe_report.csv"
with open(CSV_FILE, "w", newline="") as f:
    csv.writer(f).writerow(
        ["Time", "Name", "Helmet %", "Mask %", "Vest %", "Status",
         "Violation Duration (s)", "Severity"]
    )

# ================= MEMORY =================
buffers = {}
last_status = {}
last_violation_time = {}
violation_start_time = {}

# ================= FPS / LATENCY BUFFERS =================
fps_buffer = deque(maxlen=10)
latency_buffer = deque(maxlen=10)

# ================= CAMERA =================
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# ================= HELPER =================
def predict(model, img):
    if img is None or img.size == 0:
        return None, 0.0
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    pred = model.predict(img, verbose=0)[0]
    cls = int(np.argmax(pred))
    conf = float(pred[cls] * 100)
    return cls, conf

# ================= PERSON COLORS =================
PERSON_COLORS = [
    (120, 60, 0),
    (80, 0, 120),
    (0, 80, 120),
]

# ================= CREATE VIOLATION FOLDER =================
os.makedirs("violations", exist_ok=True)

# ================= MAIN LOOP =================
while True:
    frame_start = time.time()   # 🔴 FPS TIMER START

    ret, frame = cap.read()
    if not ret:
        break

    H, W, _ = frame.shape
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    panel_data = []

    for i, (fx, fy, fw, fh) in enumerate(faces):

        if fw * fh < 0.03 * H * W:
            continue

        person_id = f"{fx//50}_{fy//50}"

        # ---------- FACE NAME ----------
        person_name = "UNKNOWN"
        face_img = frame[fy:fy+fh, fx:fx+fw]
        fid, fconf = predict(face_model, face_img)
        if fid is not None and fconf >= FACE_CONF_THRESHOLD:
            person_name = face_names[fid]

        # ---------- INIT ----------
        if person_id not in buffers:
            buffers[person_id] = {
                "h_conf": deque(maxlen=SMOOTHING_FRAMES),
                "m_conf": deque(maxlen=SMOOTHING_FRAMES),
                "v_conf": deque(maxlen=SMOOTHING_FRAMES),
                "h_cls": deque(maxlen=SMOOTHING_FRAMES),
                "m_cls": deque(maxlen=SMOOTHING_FRAMES),
                "v_cls": deque(maxlen=SMOOTHING_FRAMES),
            }
            last_status[person_id] = None
            last_violation_time[person_id] = 0
            violation_start_time[person_id] = None

        # ---------- PPE ROIs ----------
        hx1, hx2 = fx + int(0.15*fw), fx + int(0.85*fw)
        hy2 = fy + int(0.05*fh)
        hy1 = max(0, hy2 - int(0.6*fh))

        mx1, mx2 = fx + int(0.2*fw), fx + int(0.8*fw)
        my1, my2 = fy + int(0.45*fh), fy + int(0.85*fh)

        vx1, vx2 = fx + int(0.1*fw), fx + int(0.9*fw)
        vy1, vy2 = fy + fh + 10, min(H, fy + fh + int(1.2*fh))

        helmet_region = frame[hy1:hy2, hx1:hx2]
        mask_region   = frame[my1:my2, mx1:mx2]
        vest_region   = frame[vy1:vy2, vx1:vx2]

        # ---------- PREDICT ----------
        h_cls, h_raw = predict(helmet_model, helmet_region)
        m_cls, m_raw = predict(mask_model, mask_region)
        v_cls, v_raw = predict(vest_model, vest_region)

        if h_cls is not None:
            buffers[person_id]["h_conf"].append(h_raw)
            buffers[person_id]["h_cls"].append(helmet_classes[h_cls])
        if m_cls is not None:
            buffers[person_id]["m_conf"].append(m_raw)
            buffers[person_id]["m_cls"].append(mask_classes[m_cls])
        if v_cls is not None:
            buffers[person_id]["v_conf"].append(v_raw)
            buffers[person_id]["v_cls"].append(vest_classes[v_cls])

        hconf = np.mean(buffers[person_id]["h_conf"])
        mconf = np.mean(buffers[person_id]["m_conf"])
        vconf = np.mean(buffers[person_id]["v_conf"])

        helmet_ok = Counter(buffers[person_id]["h_cls"]).most_common(1)[0][0] == "with_helmet" and hconf >= CONF_THRESHOLD
        mask_ok   = Counter(buffers[person_id]["m_cls"]).most_common(1)[0][0] == "with_mask" and mconf >= CONF_THRESHOLD
        vest_ok   = Counter(buffers[person_id]["v_cls"]).most_common(1)[0][0] == "with_vest" and vconf >= CONF_THRESHOLD

        status = "PPE COMPLIANT" if helmet_ok and mask_ok and vest_ok else "PPE NOT COMPLIANT"

        # ---------- SEVERITY ----------
        if status == "PPE COMPLIANT":
            severity = "SAFE"
        elif not helmet_ok:
            severity = "HIGH"
        elif not mask_ok:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        # ---------- VIOLATION TIMER ----------
        now = time.time()
        if status == "PPE NOT COMPLIANT":
            if violation_start_time[person_id] is None:
                violation_start_time[person_id] = now
            violation_duration = int(now - violation_start_time[person_id])
        else:
            violation_duration = 0
            violation_start_time[person_id] = None

        # ---------- CAPTURE IMAGE + BEEP ----------
        if status == "PPE NOT COMPLIANT" and now - last_violation_time[person_id] >= VIOLATION_INTERVAL:
            winsound.Beep(1000, 500)
            filename = f"violations/{person_name}_{severity}_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jpg"
            cv2.imwrite(filename, frame)
            last_violation_time[person_id] = now

        base_color = PERSON_COLORS[i % len(PERSON_COLORS)]
        color = base_color if status == "PPE COMPLIANT" else (0,0,255)

        # ---------- DRAW ----------
        cv2.rectangle(frame, (hx1,hy1),(hx2,hy2), color, 3)
        cv2.rectangle(frame, (mx1,my1),(mx2,my2), color, 3)
        cv2.rectangle(frame, (vx1,vy1),(vx2,vy2), color, 3)

        panel_data.append((hconf, mconf, vconf,
                           helmet_ok, mask_ok, vest_ok,
                           violation_duration, severity))

        # ---------- CSV ----------
        if status != last_status[person_id]:
            with open(CSV_FILE, "a", newline="") as f:
                csv.writer(f).writerow([
                    datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    person_name,
                    f"{hconf:.1f}",
                    f"{mconf:.1f}",
                    f"{vconf:.1f}",
                    status,
                    violation_duration,
                    severity
                ])
            last_status[person_id] = status

    # ---------- LEFT PANEL ----------
    y = 30
    for i, (h,m,v,hok,mok,vok,vdur,sever) in enumerate(panel_data):
        cv2.putText(frame, f"Person {i+1}", (20, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, PERSON_COLORS[i % len(PERSON_COLORS)], 2)
        y += 25
        cv2.putText(frame, f"Helmet: {int(h)}%", (20, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0,255,0) if hok else (0,0,255), 2)
        y += 20
        cv2.putText(frame, f"Mask: {int(m)}%", (20, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0,255,0) if mok else (0,0,255), 2)
        y += 20
        cv2.putText(frame, f"Vest: {int(v)}%", (20, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                    (0,255,0) if vok else (0,0,255), 2)
        y += 20
        if vdur > 0:
            cv2.putText(frame, f"Violation: {vdur}s | {sever}",
                        (20, y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)
            y += 20
        y += 10

    # ---------- FPS & LATENCY ----------
    frame_time = time.time() - frame_start
    fps = 1.0 / frame_time if frame_time > 0 else 0
    latency_ms = frame_time * 1000

    fps_buffer.append(fps)
    latency_buffer.append(latency_ms)

    cv2.putText(frame, f"FPS: {sum(fps_buffer)/len(fps_buffer):.1f}",
                (20, H - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,255), 2)
    cv2.putText(frame, f"Latency: {sum(latency_buffer)/len(latency_buffer):.0f} ms",
                (20, H - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,255,255), 2)

    cv2.imshow("PPE Compliance System", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()