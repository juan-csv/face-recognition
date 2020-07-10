from flask import Flask, request, render_template
from flask_cors import CORS
import traceback
import f_encoding_img as fenc
import f_main
import f_storage as st


app = Flask(__name__)
CORS(app)

# -------------------------- Main --------------------------------
# instanciar reconocedor de rostros
rec_face = f_main.rec()


@app.route('/')
def inicio():
    return render_template("index.html")

@app.route("/recognize_face",methods=['POST'])   
def recognize_face():
    try:
        im_b64 = request.json['im_b64']
    except:
        res = {'status':'error lectura imagen'}
        return res
    im = fenc.decodingImgb64(im_b64)
    res = rec_face.recognize_face(im)
    return res


@app.route("/register_user",methods=['POST'])
def regsiter_user():
    try:
        im_b64 = request.json['im_b64']
    except:
        res = {'status':'error lectura imagen'}
        return res
    # decodifico imagen
    im = fenc.decodingImgb64(im_b64)
    try:
        name = request.json['id_user']
    except:
        res = {'status':'error Id_user'}
        return res

    # obtengo las caracteristicas del rostro
    box_face = f_main.rec_face.detect_face(im)
    feat = f_main.rec_face.get_features(im,box_face)
    if len(feat)!=1:
        '''
        esto significa que no hay rostros o hay mas de un rostro
        '''
        res = {'status':'hay mas de un rostro en la imagen o no hay ninguno'}
        return res
    else:
        # inserto las nuevas caracteristicas en la base de datos
        status = st.insert_new_user(rec_face,name,feat,im)
        '''
        realizo publicacion informando que se hizo un cambio en la base de datos, para que todas
        las intancias actualicen su memoria interna 
        '''
        #pub_local.publicar()
        # ingestar imagen bucket 
        #cursor_storage.insert_bucket_file(im,str(name))
        res = {'status':status}
        return res



if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8080)

