/**
 *  mosaics game validation library
 */

function validateCellPosition(col,row)
{
	return (col>0 && col<=bounds[0] && row>0 && row <=bounds[1]);
}

function validateCellPositionBounds(posBounds)
{
	return (validateCellPosition(posBounds.startPos.col, posBounds.startPos.row) && 
			validateCellPosition(posBounds.endPos.col, posBounds.endPos.row) );
}

function validateColor(color)
{
	return validColors.indexOf(color) != -1;
}

function validatePoint(p) {
	var validYParts = 	["t","c","b"];
	var validXParts = 	["l","c","r"];
	
	if(p.length != 2) return false;
	
	if(	(validYParts.indexOf(p[0]) != -1 && validXParts.indexOf(p[1]) != -1) ||
		(validYParts.indexOf(p[1]) != -1 && validXParts.indexOf(p[0]) != -1 ) )
		return true;
	else return false;
}

function validateLine(p1,p2) {
	if(validatePoint(p1) && validatePoint(p2)) {
		var p1o = pointOffset(p1), p2o = pointOffset(p2);
		if (p1o[0] != p2o[0] || p1o[1] != p2o[1])
			return 0;
		else return -2;
	} else return -1;
}

function vector(point) {
	if(point != null) {
		this.x = point[0];
		this.y = point[1];		
	} else {
		this.x = 0;
		this.y = 0;
	}
	
	this.normalizedDistanceTo = function(v){
		var ret = this.sub(v);
		ret.abs();
		ret.normalize();
		return ret;
	};
	
	this.sub = function(v) {
		var ret = new vector();
		ret.x = this.x - v.x;
		ret.y = this.y - v.y;
		return ret;
	};
	
	this.abs = function() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
	};
	
	this.normalize = function() {
		var length = Math.sqrt(this.x*this.x+this.y*this.y);
		if(length == 0) {
			this.x = 0;
			this.y = 0;
		} else {
			this.x = this.x / length;
			this.y = this.y / length;			
		}
	};
	
	this.equals = function(v) {
		return this.x == v.x && this.y == v.y;
	};
}

function validateTriangle(p1,p2,p3) {
	var p1o = pointOffset(p1), p2o = pointOffset(p2), p3o = pointOffset(p3);
	var p1v = new vector(p1o), p2v = new vector(p2o), p3v = new vector(p3o);
	return !p1v.normalizedDistanceTo(p2v).equals( p1v.normalizedDistanceTo(p3v) );
}

function validateParameters(cmd, params) {
	var err=false, paramCount = 0;
	
	//validate number of parameters
	switch(cmd) {
	case "square":
	case "circle":
		paramCount = 3;
		if(params.length != paramCount) err=true;
		break;
	case "squares":
	case "circles":
		paramCount = 4;
		if(params.length != paramCount) err=true;
		break;
	case "rectangle":
	case "line":
		paramCount = 5;
		if(params.length != paramCount) err=true;
		break;
	case "triangle":
	case "lines":
		paramCount = 6;
		if(params.length != paramCount) err=true;
		break;
	case "triangles":
		paramCount = 7;
		if(params.length != paramCount) err=true;
		break;
	default:
		document.getElementById("err").innerHTML = "Unbekannter Befehl.";
	return 0;
	}
	
	if(err) {
		document.getElementById("err").innerHTML = 
			"Parameteranzahl ung&uumlltig (" + paramCount + " erwartet, "+params.length+" bekommen).";
		return 0;
	}
	
	if(cmd.charAt(cmd.length-1) == "s") {
		//validate position bounds
		var posBounds = new positionBounds(params[0] + "," + params[1] + "," + params[2]);
		if(!validateCellPositionBounds(posBounds) ) {
			document.getElementById("err").innerHTML = "Ung&uumlltiger Positionsbereich.";
			return 0;
		}
	} else {
		//validate position
		if(!validateCellPosition(params[0], params[1]) ) {
			document.getElementById("err").innerHTML = "Ung&uumlltige Position.";
			return 0;
		}		
	}
	
	//validate color
	switch(cmd) {
	case "square":
	case "circle":
		if(!validateColor(params[2])) err=true;
		break;
	case "squares":
	case "circles":
		if(!validateColor(params[3])) err=true;
		break;
	case "rectangle":
	case "line":
		if(!validateColor(params[4])) err=true;
		break;
	case "triangle":
	case "lines":
		if(!validateColor(params[5])) err=true;
		break;
	case "triangles":
		if(!validateColor(params[6])) err=true;
		break;
	}
	
	if(err) {
		document.getElementById("err").innerHTML = "Ung&uumlltige Farbe.";
		return 0;
	}
	
	//validate line
	if(cmd == "line" || cmd == "lines") {
		var errCode;
		if(cmd == "line") errCode = validateLine(params[2].toLowerCase(), params[3].toLowerCase());
		else errCode = validateLine(params[3].toLowerCase(), params[4].toLowerCase());
		if(errCode == -1)
			document.getElementById("err").innerHTML = "Ung&uumlltige Punkte.";
		else if(errCode == -2)
			document.getElementById("err").innerHTML = "Ung&uumlltige Linie (Punkte sind identisch).";
		if(errCode < 0 ) return 0;
	}
	
	//validate triangle
	if(cmd == "triangle" || cmd == "triangles") {
		var i;
		
		if(cmd == "triangle") i = 2;
		else i = 3;
		
		if(	!validatePoint(params[i].toLowerCase() ) || 
			!validatePoint(params[i+1].toLowerCase() ) || 
			!validatePoint(params[i+2].toLowerCase() ) ) {
			document.getElementById("err").innerHTML = "Ung&uumlltige Punkte.";
			return 0;			
		} else if( !validateTriangle(params[i].toLowerCase(), params[i+1].toLowerCase(), params[i+2].toLowerCase() ) ) {
			document.getElementById("err").innerHTML = "Ung&uumlltiges Dreieck (Fl&aumlche ist 0).";
			return 0;
		}
	}
	return 1;
}
