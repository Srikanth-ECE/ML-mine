import cv2
import os
import csv
import numpy as np
from datetime import datetime
from ultralytics import YOLO
import mediapipe as mp

# ================= CONFIG =================
MODEL_PATH = "runs/detect/train6/weights/best.pt"
STAFF_DIR = "staff_faces"
CSV_FILE = "attendance_log.csv"

HELMET_CONF = 0.6
VEST_CONF = 0.5
# =========================================

# Load YOLO PPE model
model = YOLO(MODEL_PATH)

# MediaPipe Face Detection (0.10.9 compatible)
mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

# Fast webcam (Windows)
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
cap.set(cv2.CAP_PROP_FPS, 30)

# ================= FACE DATABASE =================
known_faces = []

def get_embedding(face_img):
    face_img = cv2.resize(face_img, (112, 112))
    return np.mean(face_img, axis=(0, 1))

for person in os.listdir(STAFF_DIR):
    person_path = os.path.join(STAFF_DIR, person)
    if not os.path.isdir(person_path):
        continue

    for img_name in os.listdir(person_path):
        img = cv2.imread(os.path.join(person_path, img_name))
        if img is None:
            continue
        known_faces.append((person, get_embedding(img)))

# ================= CSV SETUP =================
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Name", "Time", "Status", "PPE Status", "Authorization"])

# Stores last PPE state per person (AUTHORIZED & UNAUTHORIZED)
last_ppe_status = {}

# ================= MAIN LOOP =================
frame_count = 0
helmet = False
vest = False

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (640, 480))
    frame_count += 1

    # ---------- PPE DETECTION (every 3 frames) ----------
    if frame_count % 3 == 0:
        helmet = False
        vest = False

        results = model(frame, conf=0.3, imgsz=416, verbose=False)[0]
        for box in results.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = model.names[cls]

            if label == "helmet" and conf >= HELMET_CONF:
                helmet = True
            if label == "vest" and conf >= VEST_CONF:
                vest = True

    ppe_status = "OK" if helmet and vest else "INCOMPLETE"

    # ---------- FACE DETECTION (every 2 frames) ----------
    faces = None
    if frame_count % 2 == 0:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        faces = face_detector.process(rgb)

    if faces and faces.detections:
        for det in faces.detections:
            bbox = det.location_data.relative_bounding_box
            h, w, _ = frame.shape

            x1 = int(bbox.xmin * w)
            y1 = int(bbox.ymin * h)
            x2 = int((bbox.xmin + bbox.width) * w)
            y2 = int((bbox.ymin + bbox.height) * h)

            face_img = frame[y1:y2, x1:x2]
            name = "Unknown"

            if face_img.size != 0:
                emb_live = get_embedding(face_img)
                for n, emb_db in known_faces:
                    if np.linalg.norm(emb_db - emb_live) < 40:
                        name = n
                        break

            authorized = name != "Unknown"
            auth_text = "Authorized" if authorized else "Unauthorized"
            color = (0, 255, 0) if authorized else (0, 0, 255)

            # ---------- CSV UPDATE LOGIC ----------
            current_time = datetime.now().strftime("%H:%M:%S")

            if (name not in last_ppe_status) or (last_ppe_status[name] != ppe_status):
                with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
                    writer = csv.writer(f)
                    writer.writerow([
                        name,
                        current_time,
                        "ACTIVE",
                        ppe_status,
                        auth_text
                    ])
                last_ppe_status[name] = ppe_status

            # ---------- DISPLAY ----------
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"Name: {name}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            cv2.putText(frame,
                        f"Helmet: {'YES' if helmet else 'NO'}  Vest: {'YES' if vest else 'NO'}",
                        (x1, y1 + 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            cv2.putText(frame, f"PPE: {ppe_status}", (x1, y1 + 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            cv2.putText(frame, auth_text, (x1, y1 + 45),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    cv2.imshow("PPE + Face Attendance System (FINAL)", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
