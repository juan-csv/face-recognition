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
                document.getElementById("saludo").innerText="faces: "+ names//response.faces[0].name
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
    //var nombre =document.getElementById("name").value
    //var id_type =document.getElementById("id_type").value
    //var id_number =document.getElementById("id_number").value
    //var phone =document.getElementById("phone").value


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



//Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);