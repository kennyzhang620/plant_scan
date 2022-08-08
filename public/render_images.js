var dataBaseArray = null;

function print(objectD) {
    console.log(objectD)
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

function generateCell(image_data) {

    var inner = document.getElementsByClassName("grid_display");

    if (inner != null) {

        var container = inner[0];

        var html = `<div class="cell_outer"><input class="cell" type="image" src='${image_data}'></div>`

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

                console.log("--->", parsedD);
		 		
		 		if (parsedD != null && parsedD.results != null && parsedD.results.length > 0) {
		 	    	clearCells();
		 		
                	for (var i = 0; i < parsedD.results.length; i++) {
                    	generateCell(parsedD.results[i].image_data)
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
