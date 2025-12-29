import cv2
import tensorflow as tf
import numpy as np

# ================= LOAD MODELS =================
helmet_model = tf.keras.models.load_model("helmet_model.h5")
vest_model   = tf.keras.models.load_model("vest_model.h5")
mask_model   = tf.keras.models.load_model("mask_model.h5")

helmet_classes = ["with_helmet", "without_helmet"]
vest_classes   = ["with_vest", "without_vest"]
mask_classes   = ["with_mask", "without_mask"]

CONF_THRESHOLD = 75  # %

# ================= STABLE CAMERA INIT (WINDOWS) =================
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

if not cap.isOpened():
    print("❌ Webcam not accessible")
    exit()

# ================= HELPER FUNCTION =================
def predict(model, region):
    img = cv2.resize(region, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    pred = model.predict(img, verbose=0)
    return np.argmax(pred), np.max(pred) * 100

# ================= MAIN LOOP =================
while True:
    ret, frame = cap.read()
    if not ret:
        print("⚠️ Frame grab failed")
        break

    h, w, _ = frame.shape

    # ================= REGIONS =================
    head_region = frame[0:int(h * 0.35), :]
    face_region = frame[0:int(h * 0.5), :]
    vest_region = frame[int(h * 0.35):int(h * 0.75), :]

    # ================= PREDICTIONS =================
    h_id, h_conf = predict(helmet_model, head_region)
    v_id, v_conf = predict(vest_model, vest_region)
    m_id, m_conf = predict(mask_model, face_region)

    helmet_ok = helmet_classes[h_id] == "with_helmet" and h_conf >= CONF_THRESHOLD
    vest_ok   = vest_classes[v_id] == "with_vest" and v_conf >= CONF_THRESHOLD
    mask_ok   = mask_classes[m_id] == "with_mask" and m_conf >= CONF_THRESHOLD

    # ================= DISPLAY =================
    y = 40

    def draw_status(label, ok, conf, y_pos):
        color = (0, 255, 0) if ok else (0, 0, 255)
        cv2.putText(
            frame,
            f"{label}: {conf:.1f}%",
            (20, y_pos),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            color,
            2
        )

    draw_status("Helmet", helmet_ok, h_conf, y)
    y += 35
    draw_status("Vest", vest_ok, v_conf, y)
    y += 35
    draw_status("Mask", mask_ok, m_conf, y)
    y += 45

    # ================= FINAL DECISION =================
    if helmet_ok and vest_ok and mask_ok:
        final_text = "PPE COMPLIANT"
        final_color = (0, 255, 0)
    else:
        final_text = "PPE NOT COMPLIANT"
        final_color = (0, 0, 255)

    cv2.putText(
        frame,
        final_text,
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        final_color,
        3
    )

    # ================= DRAW REGIONS =================
    cv2.rectangle(frame, (0, 0), (w, int(h * 0.35)), (255, 255, 0), 2)             # Helmet
    cv2.rectangle(frame, (0, int(h * 0.35)), (w, int(h * 0.75)), (255, 255, 0), 2) # Vest

    cv2.imshow("PPE Compliance System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ================= CLEAN EXIT =================
cap.release()
cv2.destroyAllWindows()
