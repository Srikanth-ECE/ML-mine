import cv2
import tensorflow as tf
import numpy as np

model = tf.keras.models.load_model("helmet_model.h5")
class_names = ["with_helmet", "without_helmet"]
CONF = 75

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    head = frame[0:int(h*0.6), :]

    img = cv2.resize(head, (224,224))
    img = img/255.0
    img = np.expand_dims(img, axis=0)

    pred = model.predict(img, verbose=0)
    conf = np.max(pred)*100
    idx = np.argmax(pred)

    if conf < CONF:
        label = "NO HELMET"
        color = (0,0,255)
    else:
        label = class_names[idx]
        color = (0,255,0) if label=="with_helmet" else (0,0,255)

    cv2.putText(frame, f"{label} ({conf:.1f}%)", (20,40),
                cv2.FONT_HERSHEY_SIMPLEX,1,color,2)

    cv2.imshow("Helmet Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
