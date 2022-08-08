var dataBaseArray = null;

var hoverBtn = document.getElementById("add_image");
var cBtn = document.getElementById("capture_image_menu");
var uBtn = document.getElementById("upload_image_menu");

var input = document.createElement('input');
var display_r = document.getElementById("display_res");
var display_rm = document.getElementById("display_res_main");
var uoverlay = document.getElementById("overlay");
var filtermenu = document.getElementById("filters");
var searchbar = document.getElementById("searchbar");

var hs = document.getElementById("health_status");
var ed = document.getElementById("edible");
var pp = document.getElementById("prop");
var ptype = document.getElementById("ptype");

var storedData = null;
var filterList = ["", "", "", ""]

input.type = 'file';
input.accept = "image/png, image/gif, image/jpeg";

function print(objectD) {
    console.log(objectD)
}

console.log("CLICKED! --> ", cBtn.style.animationPlayState);


uBtn.addEventListener("animationend", function () {

    if (uBtn.style.animationDirection == "reverse") {
        cBtn.style.display = "none";
        uBtn.style.display = "none";
    }
    uBtn.style.animationPlayState = "paused";
    cBtn.style.animationPlayState = "paused";
    uBtn.style.animationName = "none";
    cBtn.style.animationName = "none";
    
});

function animationState() {
    console.log("CLICKED!", cBtn.style.animationPlayState);
    cBtn.style.display = "block";
    uBtn.style.display = "block";

    if (cBtn.style.animationDirection == "reverse" || cBtn.style.animationPlayState == "") {
        cBtn.style.animationDirection = "normal";
        uBtn.style.animationDirection = "normal";
        cBtn.style.animationPlayState = "running";
        uBtn.style.animationPlayState = "running";

        hoverBtn.style.filter = "opacity(0.4) drop-shadow(0 0 0 green)";
        console.log("XX");
    }
    else if (cBtn.style.animationPlayState == "paused") {
        cBtn.style.animationDirection = "reverse";
        uBtn.style.animationDirection = "reverse";
        cBtn.style.animationPlayState = "running";
        uBtn.style.animationPlayState = "running";

        hoverBtn.style.filter = "initial";
        console.log("XX2");
    }

    uBtn.style.animationName = "topout";
    cBtn.style.animationName = "pullout";
}

hoverBtn.addEventListener('click', function (en) {

    animationState();

});


hoverBtn.addEventListener('onmouseover', function (en) {

    console.log("CLICKED!", cBtn.style.animationPlayState);

    if (cBtn.style.animationPlayState != "running") {
        cBtn.style.animationDirection = "reverse";
        uBtn.style.animationDirection = "reverse";
    }
    else {
        cBtn.style.animationPlayState = "running";
        uBtn.style.animationPlayState = "running";
    }
    
});

function modifyfilters() {
    filterList[0] = hs.value;
    filterList[1] = ed.value;
    filterList[2] = pp.value;
    filterList[3] = ptype.value;

    console.log(filterList);
    filterDisplay();
}

function subStrCheck(results, substr) {
    var query = substr;
    return results.common_name.toLowerCase().includes(query) || results.latin_name.toLowerCase().includes(query) || results.plant_description.toLowerCase().includes(query)
        || (results.disease_name != null && results.disease_name.toLowerCase().includes(query));
}
function filterDisplay() {
    if (storedData != null) {
        if (storedData != null && storedData.results != null && storedData.results.length > 0) {
            clearCells();

            var results = storedData.results;
            for (var i = 0; i < results.length; i++) {
                var allow = true

                var query = searchbar.value.toLowerCase();
                if (subStrCheck(results[i], query)) {
                    if (filterList[0] != "Any") {
                        console.log(results[i], filterList[1]);
                        if (filterList[0] == 'healthy' && (results[i].is_healthy == null || results[i].is_healthy != true)) {
                            allow = false;
                        }
                        else if (filterList[0] == "unhealthy" && (results[i].is_healthy != null && results[i].is_healthy == true)) {
                            allow = false;
                        }
                    }

                    if (filterList[1] != "Any") {
                        if (filterList[1] == "Edible" && (results[i].is_edible == null || results[i].is_edible != true)) {
                            allow = false;
                        }
                        else if (filterList[1] == "Inedible" && (results[i].is_edible != null || results[i].is_edible == true)) {
                            allow = false;
                        }
                    }

                    if (filterList[2] != "Any") {
                        if (filterList[2] == "Cutting" && (results[i].division == null || results[i].division != true)) {
                            allow = false;
                        }
                        if (filterList[2] == "Division" && (results[i].division == null || results[i].division != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Grafting" && (results[i].grafting == null || results[i].grafting != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Seeds" && (results[i].seeds == null || results[i].seeds != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Spores" && (results[i].spores == null || results[i].spores != true)) {
                            allow = false;
                        }
                        else if (filterList[2] == "Suckers" && (results[i].suckers == null || results[i].suckers != true)) {
                            allow = false;
                        }

                    }
                    if (filterList[3] != "Any") {
                        if (filterList[3] == "Food") {
                            if (!subStrCheck(results[i], "food") && !subStrCheck(results[i], "vegetable") && !subStrCheck(results[i], "fruit") && !subStrCheck(results[i], "berry") && !subStrCheck(results[i], "berries") && !subStrCheck(results[i], "edible"))
                                allow = false;
                        }
                        else {
                            if (!subStrCheck(results[i], filterList[3].toLowerCase()))
                                allow = false;
                        }
                    }

                    //    console.log(parsedD.results[i].image_data)
                }
                else {
                    allow = false;
                }

                if (allow)
                    generateCell(results[i].image64, results[i].id);
            }
        }
    }
}

function displayFilters() {
    if (filters.style.display == "none" || filters.style.display == "") {
        filters.style.display = "block";
    }
    else {
        filters.style.display = "none";
    }
}

function clearCells() {
    var inner = document.getElementsByClassName("grid_display");

    if (inner != null) {
        var container = inner[0];

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

    }
	
	console.log("cleared/");
}

function generateCell(image_data, id) {

    var inner = document.getElementsByClassName("grid_display");

    if (inner != null) {

        var container = inner[0];

        var html = `<a href=/plantscanner-api/get-image?id=${id}><div class="cell_outer"><input class="cell" type="image" src='${image_data}'></div></a>`

        var newNode = document.createRange().createContextualFragment(html);
        container.appendChild(newNode);

    }
    
}


var txtFile = new XMLHttpRequest();
txtFile.open("GET", "/plantscanner-api/get-images");

txtFile.onload = function (e) {
    if (txtFile.readyState === 4) {
        if (txtFile.status === 200) {
            var csvData = txtFile.responseText;

            if (csvData != null) {
                parsedD = JSON.parse(csvData);
                storedData = parsedD;
                console.log("--->", parsedD);
		 		
		 		if (parsedD != null && parsedD.results != null && parsedD.results.length > 0) {
		 	    	clearCells();
		 		
                        for (var i = 0; i < parsedD.results.length; i++) {

                            // if (a and B and C filters are true):

                    	generateCell(parsedD.results[i].image64, parsedD.results[i].id)
                	//    console.log(parsedD.results[i].image_data)
                	}
				}
            }

            
        }
        else {
            console.error(txtFile.statusText);
        }
    }
};

txtFile.onerror = function (e) {
    console.error(txtFile.statusText);
}; 

txtFile.send();

function LoadUploadPanel() {
    uoverlay.style.display = "block";
    animationState();
}

function HideOverlay() {
    uoverlay.style.display = "none";
}

function sendEncoded(base64) {
    var txtFile = new XMLHttpRequest();
    txtFile.open("POST", "/plantscanner-api/image64");

    txtFile.setRequestHeader("Accept", "application/json");
    txtFile.setRequestHeader("Content-Type", "application/json");

    let image_encoded = `{
     "image_data": "${base64}"
    }`;
    txtFile.onload = function (e) {
        if (txtFile.readyState === 4) {
            if (txtFile.status === 200) {
                var csvData = txtFile.responseText;
                console.log(csvData, "<<<<");
                if (csvData != '-1') {
                    console.log(csvData, "Response");
                    display_r.style = "border: 3px solid green;"
                    window.location.replace(`/plantscanner-api/get-image?id=${csvData}`);
                }
                else {
                    display_r.style = "border: 3px dashed red;"
                  //  alert("Error scanning image. Please ensure that the image you are using is a plant.");
                }

            }
            else {
                console.log("--->>>", txtFile.statusText);
                display_r.style = "border: 3px dashed red;"
            }
        }
    };

    txtFile.onerror = function (e) {
        console.error(txtFile.statusText);
    };

    txtFile.send(image_encoded);
}

function encodeImageFileAsURL(fileN) {

    display_rm.style.display = 'inline-block';

    var filesSelected = fileN;
    if (filesSelected != null) {
        var fileToLoad = filesSelected;

        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            console.log("Converted Base64 version is: ");
            console.log(srcData);

            display_r.src = srcData;

            display_r.style = "border: 3px solid grey;"
            sendEncoded(srcData);
        }
        fileReader.readAsDataURL(fileToLoad);
    }
    else {
        console.error("Not correct file!");
    }
}



function dropHandler(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file' && (ev.dataTransfer.items[i].type.match('^image/'))) {
                const file = ev.dataTransfer.items[i].getAsFile();
                console.log(`� file[${i}].name = ${file.name}`);
                encodeImageFileAsURL(file);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log(`� file[${i}].name = ${ev.dataTransfer.files[i].name}`);
        }
    }
}

input.onchange = e => {

    // getting a hold of the file reference
    var file = e.target.files[0];

    // Convert to base64
    encodeImageFileAsURL(file);
}

function dragOverHandler(ev) {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function manualHandler(ev1) {
    input.click();
}



