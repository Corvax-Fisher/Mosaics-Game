/**
 * main mosaics game library
 */

// globals
cellsize = 40;
bounds = [ 8, 8 ];
validColors = [ "aqua", "black", "blue", "fuchsia", "gray", "green", "lime",
		"maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal",
		"yellow" ];
undoHistory = [];
redoHistory = [];

function setGridSize() {
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

	// Disable OK btn
	document.getElementById("okBtn").disabled = true;
	
	//Enable Command Line and Command OK Button
	document.getElementById("cmdLine").disabled = false;
	document.getElementById("cmdBtn").disabled = false;
	
	
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

function cellToPos(col, row) {
	return [ col * cellsize, row * cellsize ];
}

function pointOffset(p) {
	var validYParts = [ "t", "c", "b" ];
	var validXParts = [ "l", "c", "r" ];
	var offsets = [ 2, cellsize / 2 + 1, cellsize ];
	var pOffset = [ 0, 0 ];

	if (p == "cc")
		pOffset = [ offsets[1], offsets[1] ];
	else if (validYParts.indexOf(p[0]) != -1 && validXParts.indexOf(p[1]) != -1) {
		pOffset[0] = offsets[validXParts.indexOf(p[1])];
		pOffset[1] = offsets[validYParts.indexOf(p[0])];
	} else if (validYParts.indexOf(p[1]) != -1
			&& validXParts.indexOf(p[0]) != -1) {
		pOffset[0] = offsets[validXParts.indexOf(p[0])];
		pOffset[1] = offsets[validYParts.indexOf(p[1])];
	}
	return pOffset;
}

function position(p) {
	var pos = p.split(",");
	if (pos.length == 2) {
		this.col = Number(pos[0]);
		this.row = Number(pos[1]);
	} else {
		this.col = this.row = -1;
	}

	this.toString = function() {
		return this.col + "," + this.row;
	};
}

function positionBounds(pB) {
	var positions = pB.split("...");
	if (positions.length == 2) {
		this.startPos = new position(positions[0]);
		this.endPos = new position(positions[1]);
	} else {
		this.startPos = this.endPos = new position("-1,-1");
	}
}

function circle(col, row, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + row);
	if (child)
		root.removeChild(child);
	var element = document.createElementNS("http://www.w3.org/2000/svg",
			"circle");
	var pos = cellToPos(col, row);

	element.setAttribute("id", "e" + col + row);
	element.setAttribute("r", cellsize / 2 - 1);
	element.setAttribute("cx", cellsize / 2 + 1 + pos[0]);
	element.setAttribute("cy", cellsize / 2 + 1 + pos[1]);

	element.style.fill = clr;

	root.appendChild(element);
}

function square(col, row, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + row);
	if (child)
		root.removeChild(child);
	var element = document
			.createElementNS("http://www.w3.org/2000/svg", "rect");
	var pos = cellToPos(col, row);

	element.setAttribute("id", "e" + col + row);
	element.setAttribute("x", pos[0] + 2);
	element.setAttribute("y", pos[1] + 2);
	element.setAttribute("width", cellsize - 2);
	element.setAttribute("height", cellsize - 2);

	element.style.fill = clr;

	root.appendChild(element);
}

function rectangle(col, row, width, height, clr) {
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			square(col + j, row + i, clr);
		}
	}
}

function line(col, row, p1, p2, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + row);
	if (child)
		root.removeChild(child);
	var element = document
			.createElementNS("http://www.w3.org/2000/svg", "line");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);

	element.setAttribute("id", "e" + col + row);
	element.setAttribute("x1", p1Offset[0] + pos[0]);
	element.setAttribute("y1", p1Offset[1] + pos[1]);
	element.setAttribute("x2", p2Offset[0] + pos[0]);
	element.setAttribute("y2", p2Offset[1] + pos[1]);

	element.style.stroke = clr;
	element.style.strokeWidth = 2;

	root.appendChild(element);
}

function triangle(col, row, p1, p2, p3, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + row);
	if (child)
		root.removeChild(child);
	var element = document.createElementNS("http://www.w3.org/2000/svg",
			"polygon");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);
	var p3Offset = pointOffset(p3);

	element.setAttribute("id", "e" + col + row);
	element
			.setAttribute("points", p1Offset[0] + pos[0] + ","
					+ Number(p1Offset[1] + pos[1]) + " "
					+ Number(p2Offset[0] + pos[0]) + ","
					+ Number(p2Offset[1] + pos[1]) + " "
					+ Number(p3Offset[0] + pos[0]) + ","
					+ Number(p3Offset[1] + pos[1]));
	element.style.fill = clr;

	root.appendChild(element);
}

function circles(posBounds, clr) {
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			circle(i, j, clr);
		}
	}
}

function lines(posBounds, p1, p2, clr) {
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			line(i, j, p1, p2, clr);
		}
	}
}

function triangles(posBounds, p1, p2, p3, clr) {
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			triangle(i, j, p1, p2, p3, clr);
		}
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

function deleteElement(pos) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + pos.col + pos.row);
	if (child)
		root.removeChild(child);
}

function deleteElements(posBounds) {
	var pos = new position("0,0");
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			pos.col = i;
			pos.row = j;
			deleteElement(pos);
		}
	}
}

function undoCommand() {
	var fullCmd = undoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		redoHistory.push(fullCmd);
		// delete elements that were added with the last command
		var cmd = fullCmd.split("(");
		if (cmd[1].indexOf("...") == -1) {
			// it's not an arry command
			if (cmd[0] == "rectangle") {
				var p2 = new position(cmd[1].substring(4, 7));
				p2.col++;
				p2.row++;
				var bounds = new positionBounds(cmd[1].substring(0, 3) + "..."
						+ p2.toString());
				deleteElements(bounds);
			} else
				deleteElement(new position(cmd[1].substring(0, 3)));
		} else {
			deleteElements(new positionBounds(cmd[1].substring(0, 9)));
		}
		
		var historyListGroup = document.getElementById("history");
		var listElements = historyListGroup.getElementsByTagName("li");
		
		for(var i = listElements.length-1;i>=0;i--) {	
			if(listElements[i].getAttribute("class") == "list-group-item active")
			{
				listElements[i].setAttribute("class","list-group-item");
				if(i > 0) listElements[i-1].setAttribute("class","list-group-item active");
				break;
			}
		}
		
		//execute second last command to add elements that may have been overwritten
		fullCmd = undoHistory.pop();
		if (fullCmd == undefined)
			return;
		else {
			cmd = fullCmd.split("(");
			var params = cmd[1].split(",");
			params[params.length - 1] = params[params.length - 1].replace(")",
					"");
			executeCommand(cmd[0], params);
			undoHistory.push(fullCmd);
		}
	}
}

function redoCommand() {
	var fullCmd = redoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		undoHistory.push(fullCmd);

		cmd = fullCmd.split("(");
		var params = cmd[1].split(",");
		params[params.length - 1] = params[params.length - 1].replace(")", "");
		executeCommand(cmd[0], params);
	}
	
	var historyListGroup = document.getElementById("history");
	var listElements = historyListGroup.getElementsByTagName("li");
	
	for(var i = listElements.length-1;i>=-1;i--) {	
		if(i == -1) {
			listElements[0].setAttribute("class","list-group-item active");
			break;
		}
		if(listElements[i].getAttribute("class") == "list-group-item active")
		{
			listElements[i].setAttribute("class","list-group-item");
			listElements[i+1].setAttribute("class","list-group-item active");
			break;
		}
	}
}

function removeRedoCmdsFromListGroup() {
	var historyListGroup = document.getElementById("history");
	var listElements = historyListGroup.getElementsByTagName("li");
	
	for(var i = listElements.length-1;i>=0;i--) {	
		if(listElements[i].getAttribute("class") == "list-group-item active")
			break;
		else if(listElements[i].getAttribute("class") == "list-group-item")
			historyListGroup.removeChild(listElements[i]);
	}
}

function addCmdToListGroup() {
	var historyListGroup = document.getElementById("history");
	var listElements = historyListGroup.getElementsByTagName("li");
	
	var li = document.createElement("li");
	li.setAttribute("class", "list-group-item active");
	var text = document.createTextNode(undoHistory[undoHistory.length-1]);
	li.appendChild(text);
	document.getElementById("history").appendChild(li);
	
	if(listElements.length > 1) 
		listElements[listElements.length-2].setAttribute("class", "list-group-item");
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

	return false;
}

// Dropdown Button for categora handler

$(function() {

	$(".dropdown-menu").on('click', 'li a', function() {
		$("#category_dropdown").text($(this).text());
		$("#category_dropdown").val($(this).text());
	});

});

// SAVE
function save() {

	if (document.getElementById("inputFileNameToSaveAs").value == "") {
		alert("Bitte Name eingeben");
		return;
	}

	if (document.getElementById("category_dropdown").value == "") {
		alert("Bitte Kategorie eingeben");
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
			'kategorie' : $("#category_dropdown").val(),
			'breite' : bounds[0],
			'hoehe' : bounds[1],
			'svg_xml' : svg_xml
		},

		success : function(response) {
			$("#gespeichert").text(response);
		}

	});

}

// if (document.getElementById("inputFileNameToSaveAs").value == ""){
// alert("Bitte Name und Kategorie eingeben");
// return;
// }

// //Create AJAX
// if (window.XMLHttpRequest)
// {
// var xmlhttp=new XMLHttpRequest();
//	  	 	
// xmlhttp.onreadystatechange = function() {
// if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
// alert(xmlhttp.responseText);
// }
// }
// }
// alert("TEST");
// xmlhttp.open("POST", "Edit_SVG_index.php" , true);
// xmlhttp.send();

// // Get the d3js SVG element
//
// var svg = document.getElementsByTagName("svg")[0];
//
//
// // Extract the data as SVG text string
// var svg_xml = new XMLSerializer().serializeToString(svg);
//    
// //PRETIFY will noch nicht ganz so
// //var svg_xml_beauty = new vkbeautify.xmlmin(svg_xml);
// //console.log(svg_xml_beauty);
// var textFileAsBlob = new Blob([svg_xml], {type:'image/svg+xml'});
// var fileNameToSaveAs =
// document.getElementById("inputFileNameToSaveAs").value;
//
// var downloadLink = document.createElement("a");
// downloadLink.download = fileNameToSaveAs;
// downloadLink.innerHTML = "Download File";
// if (window.webkitURL != null)
// {
// // Chrome allows the link to be clicked
// // without actually adding it to the DOM.
// downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
// }
// else
// {
// // Firefox requires the link to be added to the DOM
// // before it can be clicked.
// downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
// downloadLink.onclick = destroyClickedElement;
// downloadLink.style.display = "none";
// document.body.appendChild(downloadLink);
// }
//
// downloadLink.click();
