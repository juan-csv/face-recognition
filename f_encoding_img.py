import base64
import numpy as np
import cv2

# Encoding base 64
def encodingImgb64(frame):
    (flag, imJpg) = cv2.imencode(".jpg", frame)
    imEnco = base64.b64encode(imJpg).decode('utf-8')
    return imEnco

def decodingImgb64(imEnco):
    # base64--> bytes
    imEnco2 = base64.b64decode(imEnco.encode('utf-8'))
    # bytes --> jpg
    decoByte = np.frombuffer(imEnco2, dtype=np.uint8)
    # Jpg --> unit8
    decoJpg = cv2.imdecode(decoByte, cv2.IMREAD_COLOR)
    return decoJpg