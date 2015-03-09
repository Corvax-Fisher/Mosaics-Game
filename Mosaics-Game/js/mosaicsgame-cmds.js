/**
 *  mosaics game command library
 */

function square(col, row, clr) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	var pos = cellToPos(col, row);

	deleteElement( new position(col + "," + row) );

	e.setAttribute("id", "e" + col + '_' + row);
	e.setAttribute("x", pos[0] + 2);
	e.setAttribute("y", pos[1] + 2);
	e.setAttribute("width", cellsize - 2);
	e.setAttribute("height", cellsize - 2);

	e.style.fill = colorToRGB[clr];

	$("#mosaics").append(e);
}

function circle(col, row, clr) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	var pos = cellToPos(col, row);

	deleteElement( new position(col + "," + row) );

	e.setAttribute("id", "e" + col + '_' + row);
	e.setAttribute("r", cellsize / 2 - 1);
	e.setAttribute("cx", cellsize / 2 + 1 + pos[0]);
	e.setAttribute("cy", cellsize / 2 + 1 + pos[1]);

	e.style.fill = colorToRGB[clr];

	$("#mosaics").append(e);
}

function rectangle(col, row, width, height, clr) {
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			square(col + j, row + i, clr);
		}
	}
}

function line(col, row, p1, p2, clr) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", "line");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);
	
	deleteElement( new position(col + "," + row) );

	e.setAttribute("id", "e" + col + '_' + row);
	e.setAttribute("x1", p1Offset[0] + pos[0]);
	e.setAttribute("y1", p1Offset[1] + pos[1]);
	e.setAttribute("x2", p2Offset[0] + pos[0]);
	e.setAttribute("y2", p2Offset[1] + pos[1]);

	e.style.stroke = colorToRGB[clr];
	e.style.strokeWidth = 2;

	$("#mosaics").append(e);
}

function triangle(col, row, p1, p2, p3, clr) {
	var e = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);
	var p3Offset = pointOffset(p3);
	
	deleteElement( new position(col + "," + row) );

	e.setAttribute("id", "e" + col + '_' + row);
	e.setAttribute("points", p1Offset[0] + pos[0] + ","
					+ Number(p1Offset[1] + pos[1]) + " "
					+ Number(p2Offset[0] + pos[0]) + ","
					+ Number(p2Offset[1] + pos[1]) + " "
					+ Number(p3Offset[0] + pos[0]) + ","
					+ Number(p3Offset[1] + pos[1]));
	e.style.fill = colorToRGB[clr];

	$("#mosaics").append(e);
}

function squares(posBounds, clr) {
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			square(i, j, clr);
		}
	}
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

function deleteElement(pos) {
	var element = $("#e" + pos.col + '_' + pos.row);
	
	if(elementHistory[pos.toString()] == undefined) 
		elementHistory[pos.toString()] = [];
	elementHistory[pos.toString()].push(element);
	element.remove();
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

function rectangleBounds(params) {
	var p2 = new position(params[2] + "," + params[3]);
	p2.col += Number(params[0]) - 1;
	p2.row += Number(params[1]) - 1;
	return new positionBounds(params[0] + "," + params[1] + "..."
			+ p2.toString());
}

function restoreElements(posBounds) {
	var element = undefined;
	var mosaicsSVG = $("#mosaics");
	for (var i = posBounds.startPos.col; i <= posBounds.endPos.col; i++) {
		for (var j = posBounds.startPos.row; j <= posBounds.endPos.row; j++) {
			if(elementHistory[i + "," + j])
				element = elementHistory[i + "," + j].pop();
			$("#e" + i + "_" + j).remove();
			if(element) mosaicsSVG.append(element);
		}
	}	
}

function restoreDeletedElements(cmd, params) {
	var element = undefined;
	var mosaicsSVG = $("#mosaics");
	if( cmd[1].indexOf("...") == -1) {
		// it's not an arry command
		if( cmd[0] == "rectangle" ) {
			var bounds = rectangleBounds(params);
			restoreElements(bounds);
		} else {
			if(elementHistory[params[0] + "," + params[1]])
				element = elementHistory[params[0] + "," + params[1]].pop();
			$("#e" + params[0] + "_" + params[1]).remove();
			if(element) mosaicsSVG.append(element);			
		}
	}
	else {
		var posBounds = new positionBounds(params[0] + "," + params[1] + "," + params[2].replace(")","") );
		restoreElements(posBounds);
	}
}

function undoCommand() {
	var fullCmd = undoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		var cmd = fullCmd.split("(");
		var params = cmd[1].replace(")","").split(",");

		redoHistory.push(fullCmd);
		document.getElementById("redoBtn").disabled = false;
		
		restoreDeletedElements(cmd, params);

		var historyListGroup = document.getElementById("history");
		var listElements = historyListGroup.getElementsByTagName("li");
		
		for(var i = listElements.length-1; i >= 0; i--) {	
			if(listElements[i].getAttribute("class") == "list-group-item active")
			{
				listElements[i].setAttribute("class","list-group-item");
				if(i > 0) listElements[i-1].setAttribute("class","list-group-item active");
				break;
			}
		}
		
		if (undoHistory.length == 0) 
			document.getElementById("undoBtn").disabled = true;
	}
}

function redoCommand() {
	var fullCmd = redoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		if(redoHistory.length == 0)
			document.getElementById("redoBtn").disabled = true;

		undoHistory.push(fullCmd);
		document.getElementById("undoBtn").disabled = false;
		
		var cmd = fullCmd.split("(");
		var params = cmd[1].split(",");
		params[params.length - 1] = params[params.length - 1].replace(")", "");
		executeCommand(fullCmd);
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

function manageHistory(command) {
	var cmdAndParams = command.split("(");
	var cmd = cmdAndParams[0], params = cmdAndParams[1];
	
	params = params.replace(")","");
	params = params.split(/,|\.\.\./);
	
	if(	$("#color_dropdown").val() != "(None)" && 
		requiredParamCountForCmd(cmd) == params.length+1)
		command = command.replace(")","," + $("#color_dropdown").val() + ")");
	
	undoHistory.push(command);
	redoHistory = [];
	removeRedoCmdsFromListGroup();
	addCmdToListGroup();
	document.getElementById("undoBtn").disabled = false;
	document.getElementById("redoBtn").disabled = true;
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
		if(this.startPos.col > this.endPos.col)
		{
			var tmp = this.startPos.col;
			this.startPos.col = this.endPos.col;
			this.endPos.col = tmp;
		}
		if(this.startPos.row > this.endPos.row)
		{
			var tmp = this.startPos.row;
			this.startPos.row = this.endPos.row;
			this.endPos.row = tmp;
		}
	} else {
		this.startPos = this.endPos = new position("-1,-1");
	}
}