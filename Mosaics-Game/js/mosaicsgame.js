/**
 * main mosaics game library
 */

// globals
cellsize = 40;
bounds = [ 8, 8 ];
validColors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime",
		"maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal",
		"yellow" ];
undoHistory = [];
redoHistory = [];

function setGridSize() {

	document.getElementById("okBtn").disabled = false;
	// Hide Radio Button
	// document.getElementById("GridSelect").style.visibility="hidden";

	// If drop down list is used
	// var selectedValue = document.getElementById("gridSelect").value;
	// document.getElementById("gridSelect").disabled = true;
	// End If


	// If radio buttons are used
	var gridSelect = document.getElementById("gridSelect");
	var selectedValue = "";
	for (var i = 0; i < gridSelect.elements.length; i++) {
		// gridSelect.elements.item(i).disabled = true;
		if (gridSelect.elements.item(i).checked)
			selectedValue = gridSelect.elements.item(i).value;
	}
	// End If

	bounds = selectedValue.split("x");
	bounds[0] = Number(bounds[0]);
	bounds[1] = Number(bounds[1]);

	// Check count of Rows for cellsize
	if (bounds[0] > 12 || bounds[1] > 12)
		cellsize = 20;
	else
		cellsize = 40;

	// bounds[0] = col;
	// bounds[1] = row;

	var strValidColors = "";
	for (var i = 0; i < validColors.length; i++)
		strValidColors += "<span style=color:" + validColors[i] + ">"
				+ validColors[i] + "</span>" + ", ";
	document.getElementById("clrs").innerHTML = "Verf&uumlgbare Farben: <br>"
			+ strValidColors;

	// Set SVG-Canvas attributes
	var svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute("width", cellsize * (Number(bounds[0]) + 1) + 2);
	svg.setAttribute("height", cellsize * (Number(bounds[1]) + 1) + 2);

	// Set pattern attributes
	var pattern = svg.getElementById("pattern1");
	pattern.setAttribute("width", cellsize);
	pattern.setAttribute("height", cellsize);
	var vline = svg.getElementById("vline");
	vline.setAttribute("y2", cellsize);
	var hline = svg.getElementById("hline");
	hline.setAttribute("x2", cellsize);

	// Set bounding rect attributes
	var rect = svg.getElementsByTagName("rect")[0];
	rect.setAttribute("x", cellsize);
	rect.setAttribute("y", cellsize);
	rect.setAttribute("width", cellsize * bounds[0] + 2);
	rect.setAttribute("height", cellsize * bounds[1] + 2);

	// GridSizeNumber
	// index = document.createElementNS("http://www.w3.org/2000/svg", "text");
	// index.setAttribute("id", "index");
	// pos = cellToPos(bounds[0],bounds[1]);
	// index.setAttribute("x", 10);
	// index.setAttribute("y", 15);
	// index.setAttribute("style","font-size:10px");
	// index.setAttribute("style","fill:red");
	// index.setAttribute("text-anchor","right");
	// index.appendChild(document.createTextNode(bounds[0] +" x " + bounds[1]));
	// svg.appendChild(index);

}

function gridSizeOk() {
	// Disable radio buttons
	var gridSelect = document.getElementById("gridSelect");
	for (var i = 0; i < gridSelect.elements.length; i++) {
		gridSelect.elements.item(i).disabled = true;
	}

	// Change Grid Color
	document.getElementById("hline").style.stroke = "black";
	document.getElementById("vline").style.stroke = "black";

	document.getElementById("okBtn").disabled = true;
	enableAndDisableElements(false);
	
	var jumbotronArray = document.getElementsByClassName("jumbotron");
	var i;
	jumbotronArray[0].style.border = "";
	for (i=1;i<jumbotronArray.length;i++) {
		jumbotronArray[i].style.backgroundColor = "#EEEEEE";
	}
	
	//Iterate Grid Numbers
	var svg = document.getElementsByTagName("svg")[0];
	var number;
	var pos;
	for (var i = 0; i < bounds[0]; i++) {
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(i + 1, 0);
		number.setAttribute("id", "n" + (i + 1) + 0);
		number.setAttribute("x", pos[0] + cellsize / 2);
		number.setAttribute("y", pos[1] + cellsize * 0.7);
		number.setAttribute("text-anchor", "middle");
		number.appendChild(document.createTextNode(i + 1));
		svg.appendChild(number);
	}
	for (var i = 0; i < bounds[1]; i++) {
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(0, i + 1);
		number.setAttribute("id", "n" + 0 + (i + 1));
		number.setAttribute("x", pos[0] + cellsize / 2);
		number.setAttribute("y", pos[1] + cellsize * 0.7);
		number.setAttribute("text-anchor", "middle");
		number.appendChild(document.createTextNode(i + 1));
		svg.appendChild(number);
	}

}

function executeCommand(cmdName, cmdParams) {
	switch (cmdName) {
	case "square":
		square(cmdParams[0], cmdParams[1], cmdParams[2]);
		break;
	case "circle":
		circle(Number(cmdParams[0]), Number(cmdParams[1]), cmdParams[2]);
		break;
	case "rectangle":
		rectangle(Number(cmdParams[0]), Number(cmdParams[1]),
				Number(cmdParams[2]), Number(cmdParams[3]), cmdParams[4]);
		break;
	case "line":
		line(cmdParams[0], cmdParams[1], cmdParams[2].toLowerCase(),
				cmdParams[3].toLowerCase(), cmdParams[4]);
		break;
	case "triangle":
		triangle(cmdParams[0], cmdParams[1], cmdParams[2].toLowerCase(),
				cmdParams[3].toLowerCase(), cmdParams[4].toLowerCase(),
				cmdParams[5]);
		break;
	case "squares":
		squares(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3]);
		break;
	case "circles":
		circles(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3]);
		break;
	case "lines":
		lines(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3].toLowerCase(), cmdParams[4]
				.toLowerCase(), cmdParams[5]);
		break;
	case "triangles":
		triangles(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3].toLowerCase(), cmdParams[4]
				.toLowerCase(), cmdParams[5].toLowerCase(), cmdParams[6]);
		break;
	}
}

function draw(form) {
	if (document.getElementById("err").innerHTML.length > 0)
		document.getElementById("err").innerHTML = "";
		
	var cmd = form.cmd.value.split("(");
	if (cmd.length == 2) {
		var params = cmd[1].split(",");
		if (params[params.length - 1].indexOf(")") == -1)
			document.getElementById("err").innerHTML = "Schlie&szligende Klammer fehlt.";
		else {
			params[params.length - 1] = params[params.length - 1].replace(")",
					"");
			if (validateParameters(cmd[0], params)) {
				executeCommand(cmd[0], params);
				undoHistory.push(form.cmd.value);
				redoHistory = [];
				removeRedoCmdsFromListGroup();
				addCmdToListGroup();
			}
		}
	} else
		document.getElementById("err").innerHTML = "&Oumlffnende Klammer fehlt.";
	
	if (document.getElementById("err").innerHTML.length > 0) {
		document.getElementById("messages").style.display = "block";
	} else {
		document.getElementById("messages").style.display = "none";
	}
	
	return false;
}

// Dropdown Button for categora handler

$(function() {

	$(".catdd").on('click', 'li a', function() {
		$("#category_dropdown").text($(this).text());
		$("#category_dropdown").val($(this).text());
	});
	
	$(".difdd").on('click', 'li a', function() {
		$("#dif_dropdown").text($(this).text());
		$("#dif_dropdown").val($(this).text());
	});
	
	enableAndDisableElements(true);
	$( ".jumbotron" ).blur();
	var jumbotronArray = document.getElementsByClassName("jumbotron");
	var i;
	
	jumbotronArray[0].style.border = "thick solid black";
	for (i=1;i<jumbotronArray.length;i++) {
		jumbotronArray[i].style.backgroundColor = "#F8F8F8";
	}
});






// SAVE
function save() {

	if (undoHistory.length == 0){
		document.getElementById("save_err").innerHTML = "Please draw something first";
		document.getElementById("save_messages").style.display = "block";
		return;
	}
	
	if (document.getElementById("inputFileNameToSaveAs").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose name";
		document.getElementById("save_messages").style.display = "block";
		return;
	}

	if (document.getElementById("category_dropdown").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose category";
		document.getElementById("save_messages").style.display = "block";
		return;
	}
	
	if (document.getElementById("dif_dropdown").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose difficulty";
		document.getElementById("save_messages").style.display = "block";
		return;
	}
	
	var svg = document.getElementsByTagName("svg")[0];

	// Extract the data as SVG text string
	var svg_xml = new XMLSerializer().serializeToString(svg);

	// Jquery AJAX
	$.ajax({

		type : 'POST',
		url : 'PHP/EDIT_SVG_index.php',
		data : {
			'name' : $("#inputFileNameToSaveAs").val(),
			'category' : $("#category_dropdown").val(),
			'dif' : $("#dif_dropdown").val(),
			'width' : bounds[0],
			'length' : bounds[1],
			'svg_xml' : svg_xml
		},

		success : function(response) {
			document.getElementById("save_messages").style.display = "block";
			$("#save_err").text(response);
			
		}

	});

}

function enableAndDisableElements(bool) {
	var elements = ["resetBtn","cmdLine","cmdBtn","redoBtn","undoBtn","inputFileNameToSaveAs","category_dropdown","dif_dropdown","saveBtn"];
	var i;
	
	for(i=0;i<elements.length;i++) {
		document.getElementById(elements[i]).disabled = bool;
	}
	
}
