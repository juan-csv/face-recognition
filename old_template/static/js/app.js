// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
//var url_root = "http://localhost:8080/"
var url_root = location.protocol + '//' + document.domain + ':' + location.port + "/"
var endpoint_recognize_face = "recognize_face"
var endpoint_register = "register_user"


// Define constants
const cameraView = document.querySelector("#camera--view");
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
    cameraButton = document.querySelector("#new_register")
    boton_load = document.querySelector("#boton_load")
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
            setInterval(sendPicture, 1000)
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}
function sendPicture() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    let imagen = cameraSensor.toDataURL().split(",")[1];
    let url = url_root+endpoint_recognize_face
    var request = new XMLHttpRequest();
    var params = {"im_b64":imagen};
    request.open('POST', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status==200) {
            let response = JSON.parse(this.responseText)

            var names = ""
            for (var x in response.names){
                names += response.names[x]+" "
            }

            if (!Array.isArray(response)){
                document.getElementById("saludo").innerText="Hi "+ names//response.faces[0].name
            }else{
                document.getElementById("saludo").innerText=""
            }
        }
    };
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(params));
    
}
cameraButton.onclick=function(){
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    let imagen = cameraSensor.toDataURL().split(",")[1];
    let url = url_root+endpoint_register;
    let nombre =  prompt("Ingresa tu nombre: ")
    var request = new XMLHttpRequest();
    var params = {"im_b64":imagen,"id_user":nombre};
    request.open('POST', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status==200) {
            let response = this.responseText
            console.log(this.responseText)
            alert(response)
        }
    };
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(params));
}


function previewFile() {
    var canvas = document.getElementById('foto');
    var file    = document.querySelector('input[type=file]').files[0];
    var img = new Image();
    
    
    if (file.type.match('image.*')) {
        var reader  = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (evt) {
            img.src = evt.target.result;
            let url = url_root+endpoint_register;
            let nombre =  prompt("Ingresa el nombre de la persona: ")
            var request = new XMLHttpRequest();
            var params = {"im_b64":img.src.split(",")[1], "id_user":nombre};
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status==200) {
                    let response = this.responseText
                    console.log(this.responseText)
                    alert(response)
                }
            };
            request.open('POST', url, true);
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(params));
            boton_load.value = null
        }
    } else {
      alert("Not an image")
    }

  }

//Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);