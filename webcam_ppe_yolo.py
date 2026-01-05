import cv2
from ultralytics import YOLO

# Load your trained PPE YOLO model
model = YOLO("ppe_yolov8n.pt")

# Class IDs (from data.yaml)
HARDHAT = 0
MASK = 1
PERSON = 2
VEST = 3

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, conf=0.4, verbose=False)[0]

    persons = []
    items = []

    # Separate persons and PPE items
    for box in results.boxes:
        cls = int(box.cls[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        if cls == PERSON:
            persons.append((x1, y1, x2, y2))
        else:
            items.append((cls, x1, y1, x2, y2))

    # Check PPE for each person
    for (px1, py1, px2, py2) in persons:
        helmet_ok = False
        mask_ok = False
        vest_ok = False

        for (cls, x1, y1, x2, y2) in items:
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

            if px1 <= cx <= px2 and py1 <= cy <= py2:
                if cls == HARDHAT:
                    helmet_ok = True
                elif cls == MASK:
                    mask_ok = True
                elif cls == VEST:
                    vest_ok = True

        compliant = helmet_ok and mask_ok and vest_ok
        color = (0, 255, 0) if compliant else (0, 0, 255)

        cv2.rectangle(frame, (px1, py1), (px2, py2), color, 2)
        cv2.putText(
            frame,
            "PPE OK" if compliant else "PPE VIOLATION",
            (px1, py1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2
        )

    cv2.imshow("YOLO PPE Webcam", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
