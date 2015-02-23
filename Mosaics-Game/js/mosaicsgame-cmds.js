/**
 *  mosaics game command library
 */

function square(col, row, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + '_' + row);
	if (child)
		root.removeChild(child);
	var element = document
			.createElementNS("http://www.w3.org/2000/svg", "rect");
	var pos = cellToPos(col, row);

	element.setAttribute("id", "e" + col + '_' + row);
	element.setAttribute("x", pos[0] + 2);
	element.setAttribute("y", pos[1] + 2);
	element.setAttribute("width", cellsize - 2);
	element.setAttribute("height", cellsize - 2);

	element.style.fill = clr;

	root.appendChild(element);
}

function circle(col, row, clr) {
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + col + '_' + row);
	if (child)
		root.removeChild(child);
	var element = document.createElementNS("http://www.w3.org/2000/svg",
			"circle");
	var pos = cellToPos(col, row);

	element.setAttribute("id", "e" + col + '_' + row);
	element.setAttribute("r", cellsize / 2 - 1);
	element.setAttribute("cx", cellsize / 2 + 1 + pos[0]);
	element.setAttribute("cy", cellsize / 2 + 1 + pos[1]);

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
	var child = root.getElementById("e" + col + '_' + row);
	if (child)
		root.removeChild(child);
	var element = document
			.createElementNS("http://www.w3.org/2000/svg", "line");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);

	element.setAttribute("id", "e" + col + '_' + row);
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
	var child = root.getElementById("e" + col + '_' + row);
	if (child)
		root.removeChild(child);
	var element = document.createElementNS("http://www.w3.org/2000/svg",
			"polygon");
	var pos = cellToPos(col, row);

	var p1Offset = pointOffset(p1);
	var p2Offset = pointOffset(p2);
	var p3Offset = pointOffset(p3);

	element.setAttribute("id", "e" + col + '_' + row);
	element.setAttribute("points", p1Offset[0] + pos[0] + ","
					+ Number(p1Offset[1] + pos[1]) + " "
					+ Number(p2Offset[0] + pos[0]) + ","
					+ Number(p2Offset[1] + pos[1]) + " "
					+ Number(p3Offset[0] + pos[0]) + ","
					+ Number(p3Offset[1] + pos[1]));
	element.style.fill = clr;

	root.appendChild(element);
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
	var root = document.getElementsByTagName("svg")[0];
	var child = root.getElementById("e" + pos.col + '_' + pos.row);
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
		var params = cmd[1].split(",");
		if (cmd[1].indexOf("...") == -1) {
			// it's not an arry command
			if (cmd[0] == "rectangle") {
				var p2 = new position(params[2] + "," + params[3]);
				p2.col += Number(params[0]) - 1;
				p2.row += Number(params[1]) - 1;
				var bounds = new positionBounds(params[0] + "," + params[1] + "..."
						+ p2.toString());
				deleteElements(bounds);
			} else
				deleteElement(new position(params[0] + "," + params[1]));
		} else {
			deleteElements(new positionBounds(params[0] + "," + params[1] + "," + params[2]));
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

		var cmd = fullCmd.split("(");
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