// JavaScript source code
let video = document.querySelector("#video_feed");
let capture_btn = document.querySelector("#capture_image");
let output = document.querySelector("#captured_out");
let errorPopup = document.getElementById("warning");
async function initCamera() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
    }
    catch (err) {
        //  alert("Error accessing camera. \nCode: " + err);
        errorPopup.style.display = "block";
    }
}

capture_btn.addEventListener('click', function () {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    // data url of the image
    console.log(image_data_url);
});


initCamera();