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

// function rectangle(col, row, width, height, clr) {
	// for (var i = 0; i < height; i++) {
		// for (var j = 0; j < width; j++) {
			// square(col + j, row + i, clr);
		// }
	// }
// }

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

function squares(posRanges, clr) {
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			square(Math.abs(i), Math.abs(j), clr);
		}
	}
}

function circles(posRanges, clr) {
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			circle(Math.abs(i), Math.abs(j), clr);
		}
	}
}

function lines(posRanges, p1, p2, clr) {
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			line(Math.abs(i), Math.abs(j), p1, p2, clr);
		}
	}
}

function triangles(posRanges, p1, p2, p3, clr) {
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			triangle(Math.abs(i), Math.abs(j), p1, p2, p3, clr);
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

function deleteElements(posRanges) {
	var pos = new position("0,0");
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			pos.col = Math.abs(i);
			pos.row = Math.abs(j);
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

function rectangleRanges(params) {
	var inc = [];
	var colRangeStr = params[0];
	var rowRangeStr = params[1];
	
	inc[0] = (Number(params[2]) > 0) ? 1 : -1;
	inc[1] = (Number(params[3]) > 0) ? 1 : -1;
	if(Number(params[2]) == 0) colRangeStr += ":0";
	if(Number(params[3]) == 0) rowRangeStr += ":0";
	colRangeStr += ":" + (Number(params[0]) + Number(params[2]) - inc[0]).toString();
	rowRangeStr += ":" + (Number(params[1]) + Number(params[3]) - inc[1]).toString();
	return new positionRanges(colRangeStr,rowRangeStr);
}

function restoreElements(posRanges) {
	var element = undefined;
	var mosaicsSVG = $("#mosaics");
	
	for (var i = posRanges.colRange.from; 
			i <= posRanges.colRange.to; 
			i += posRanges.colRange.inc) {
		for (var j = posRanges.rowRange.from; 
			j <= posRanges.rowRange.to; 
			j += posRanges.rowRange.inc) {
			if(elementHistory[Math.abs(i) + "," + Math.abs(j)])
				element = elementHistory[Math.abs(i) + "," + Math.abs(j)].pop();
			$("#e" + Math.abs(i) + "_" + Math.abs(j)).remove();
			if(element) mosaicsSVG.append(element);
		}
	}	
}

function restoreDeletedElements(cmd, params) {
	var element = undefined;
	var mosaicsSVG = $("#mosaics");
	// if(cmd.charAt(cmd.length-1) != "s") {
		// // it's not an arry command
		// if( cmd == "rectangle" ) {
			// var ranges = rectangleRanges(params); //rectangleBounds(params);
			// restoreElements(ranges);
		// } else {
			// if(elementHistory[params[0] + "," + params[1]])
				// element = elementHistory[params[0] + "," + params[1]].pop();
			// $("#e" + params[0] + "_" + params[1]).remove();
			// if(element) mosaicsSVG.append(element);			
		// }
	// }
	// else {
		// var posBounds = new positionBounds(params[0] + "," + params[1] + "," + params[2].replace(")","") );
		// restoreElements(posBounds);
		var posRanges;
		if( cmd == "rectangle" ) posRanges = rectangleRanges(params);
		else posRanges = new positionRanges(params[0],params[1]);
		restoreElements(posRanges);
	// }
}

function undoCommand() {
	var fullCmd = undoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		var cmdAndParams = fullCmd.split("(");
		var cmd = cmdAndParams[0];
		var params = cmdAndParams[1].replace(")","").split(",");

		redoHistory.push(fullCmd);
		document.getElementById("redoBtn").disabled = false;
		
		restoreDeletedElements(cmd, params);

		$("#cmdCount").text(undoHistory.length);
		$("#history > li.active")
			.toggleClass("active")
			.prev()
			.toggleClass("active");
		
		if (undoHistory.length == 0) 
			$("#undoBtn").prop("disabled", true);
	}
}

function redoCommand() {
	var fullCmd = redoHistory.pop();

	if (fullCmd == undefined)
		return;
	else {
		if(redoHistory.length == 0)
			$("#redoBtn").prop("disabled", true);

		undoHistory.push(fullCmd);
		document.getElementById("undoBtn").disabled = false;
		
		var cmd = fullCmd.split("(");
		var params = cmd[1].split(",");
		params[params.length - 1] = params[params.length - 1].replace(")", "");
		executeCommand(fullCmd);
		
		$("#cmdCount").text(undoHistory.length);
		if($("#history > li.active").length == 0)
			$("#history > li:first-child").toggleClass("active");
		else
			$("#history > li.active")
				.toggleClass("active")
				.next()
				.toggleClass("active");
	}
}

function removeRedoCmdsFromListGroup() {
	var $lastCommand = $("#history > li.active");
	if($lastCommand.length == 0) $("#history").empty();
	else $lastCommand.nextAll().remove();
}

function addCmdToListGroup(command) {
	$("#history > li:last-child").toggleClass("active");
	$("#history")
		.append("<li class='list-group-item active'>"+
				command + "</li>");
}

function manageHistory(command) {
	var cmdAndParams = command.split("(");
	var cmd = cmdAndParams[0], params = cmdAndParams[1];
	
	params = params.replace(")","");
	params = params.split(",");
	
	if(	$("#color_dropdown").val() != "(None)" && 
		requiredParamCountForCmd(cmd) == params.length+1)
		command = command.replace(")","," + $("#color_dropdown").val() + ")");
	
	undoHistory.push(command);
	redoHistory = [];
	removeRedoCmdsFromListGroup();
	addCmdToListGroup(command);
	$("#undoBtn").prop("disabled", false);
	$("#redoBtn").prop("disabled", true);
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

function positionRange(rangeStr) {
	var range = rangeStr.split(":");
	
	if (range.length == 3) {
		this.from = Number(range[0]);
		this.inc = Number(range[1]);
		this.to = Number(range[2]);
	} else if(range.length == 2) {
		this.from = Number(range[0]);
		this.to = Number(range[1]);
		if(this.to >= this.from) this.inc = 1;
		else this.inc = -1;
	} else if(range.length == 1) {
		this.from = this.to = Number(range[0]);
		this.inc = 1;
	} else {
		this.from = this.to = this.inc = Number.NaN;
	}
	
	this.swapSign = function() {
		this.from *= -1;
		this.inc *= -1;
		this.to *= -1;
		this.signSwapped = true;
	}
	
	if(this.from > this.to && this.from >= 0 && this.to >= 0) this.swapSign();
	else this.signSwapped = false;
	
	this.validateInc = function() {
		return  (this.to-this.from >= 0 && this.inc > 0 &&
				this.inc == parseInt(this.inc) )
	};
}

function positionRanges(colStr, rowStr) {
	this.colRange = new positionRange(colStr);
	this.rowRange = new positionRange(rowStr);
	
	this.validate = function() {
		var errMsg = "Invalid position Ranges (", err=false;
		
		if(this.colRange.signSwapped) this.colRange.swapSign();
		if(this.rowRange.signSwapped) this.rowRange.swapSign();
		
		if(Number.isNaN(this.colRange.from) || 
			this.colRange.from < 1 ||
			this.colRange.from > bounds[0] ||
			this.colRange.from != parseInt(this.colRange.from) ) {
			errMsg += "colum start position";
			err = true;
		}
		if(Number.isNaN(this.colRange.to) || 
			this.colRange.to < 1 ||
			this.colRange.to > bounds[0] ||
			this.colRange.to != parseInt(this.colRange.to)) {
			if(err) errMsg += ", ";
			errMsg += "colum end position";
			err = true;
		}
		
		if(this.colRange.signSwapped) this.colRange.swapSign();
		if(this.colRange.inc != 1) {
			if(!this.colRange.validateInc()) {
				if(err) errMsg += ", ";
				errMsg += "colum increment"
				err = true;
			}
		}
		if(this.colRange.signSwapped) this.colRange.swapSign();
		
		if(Number.isNaN(this.rowRange.from) || 
			this.rowRange.from < 1 ||
			this.rowRange.from > bounds[1] ||
			this.rowRange.from != parseInt(this.rowRange.from)) {
			if(err) errMsg += ", ";
			errMsg += "row start position"
			err = true;
		}
		if(Number.isNaN(this.rowRange.to) || 
			this.rowRange.to < 1 ||
			this.rowRange.to > bounds[1] ||
			this.rowRange.to != parseInt(this.rowRange.to)) {
			if(err) errMsg += ", ";
			errMsg += "row end position"
			err = true;
		}
		
		if(this.rowRange.signSwapped) this.rowRange.swapSign();
		if(this.rowRange.inc != 1) {
			if(!this.rowRange.validateInc()) {
				if(err) errMsg += ", ";
				errMsg += "row increment"
				err = true;
			}
		}
		if(this.rowRange.signSwapped) this.rowRange.swapSign();
		
		if(err) return errMsg + ").";
		else return undefined;
	};
}