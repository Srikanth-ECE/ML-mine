import cv2
import tensorflow as tf
import numpy as np

# Load trained vest model
model = tf.keras.models.load_model("vest_model.h5")

# MUST match training output
class_names = ["with_vest", "without_vest"]

CONF_THRESHOLD = 75  # confidence %

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Webcam not accessible")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape

    # 🔹 Vest region (upper–mid body)
    vest_region = frame[int(h*0.35):int(h*0.75), :]

    # Preprocess
    img = cv2.resize(vest_region, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    # Prediction
    preds = model.predict(img, verbose=0)
    confidence = np.max(preds) * 100
    class_id = np.argmax(preds)

    # Decision logic
    if confidence < CONF_THRESHOLD:
        label = "NO VEST (UNCERTAIN)"
        color = (0, 0, 255)
    else:
        label = class_names[class_id]
        color = (0, 255, 0) if label == "with_vest" else (0, 0, 255)

    # Draw region box
    cv2.rectangle(
        frame,
        (0, int(h*0.35)),
        (w, int(h*0.75)),
        (255, 255, 0),
        2
    )

    # Display label
    cv2.putText(
        frame,
        f"{label} ({confidence:.1f}%)",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2
    )

    cv2.imshow("Vest Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
