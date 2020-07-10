# --------------------- para el test -------------------------
import cv2
import f_encoding_img as fenc
import requests
import config as cfg
import os

i = 1
li = ['guido.jpg','guido2.jpg','none.jpg']
im_raw = cv2.imread(cfg.path_images+os.sep+li[i])
# input imagen en base64
imb64 = fenc.encodingImgb64(im_raw)
# --------------------- para el test -------------------------

url= "http://localhost:8080/"
endpoint = "recognize_face"

myjson = {'im_b64':imb64}
r = requests.post(url=url+endpoint, json={'im_b64':imb64})
r.json()