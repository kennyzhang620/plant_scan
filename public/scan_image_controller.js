// JavaScript source code
let video = document.querySelector("#video_feed");
let videoEle = document.getElementById('video_feed');
let capture_btn = document.querySelector("#capture_image");
let switch_button = document.getElementById('switch_cam');
let output = document.querySelector("#captured_out");
let errorPopup = document.getElementById("warning");
let toolTip1 = document.getElementById("tooltip");

var currentMode = 'environment';

async function initCamera(mode='environment') {
    var error = false;

    if (video.srcObject != null) {
        video.srcObject.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    try {
        let stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: mode
            },
            audio: false
        });

        video.srcObject = stream;
    }
    catch (err) {
        console.log("Error accessing camera. \nCode: " + err);
        errorPopup.style.display = "block";
        error = true;

    }

    if (!error)
        toolTip1.style.display = "block";
}

switch_button.addEventListener('click', function () {

    if (currentMode == 'user')
        currentMode = 'environment';
    else
        currentMode = 'user';


    initCamera(currentMode)
});

capture_btn.addEventListener('click', function () {
    output.getContext('2d').drawImage(video, 0, 0, output.width, output.height);
    let image_data_url = output.toDataURL('image/jpeg');

    // data url of the image
    console.log(image_data_url);

    video.srcObject = null;

    var txtFile = new XMLHttpRequest();
    txtFile.open("POST", "/plantscanner-api/image64_test");

    txtFile.setRequestHeader("Accept", "application/json");
    txtFile.setRequestHeader("Content-Type", "application/json");

    let image_encoded = `{
     "image_data": "${image_data_url}"
    }`;
    txtFile.onload = function (e) {
        if (txtFile.readyState === 4) {
            if (txtFile.status === 200) {
                var csvData = txtFile.responseText;

                console.log(csvData, "Response");


            }
            else {
                console.error(txtFile.statusText);
            }
        }
    };

    txtFile.onerror = function (e) {
        console.error(txtFile.statusText);
    };

    txtFile.send(image_encoded);

    initCamera(currentMode);
});

initCamera(currentMode);