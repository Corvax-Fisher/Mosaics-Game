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

function validateParameters(cmdLine) {
	var err=false, paramCount = 0;
	
	var cmdAndParams = cmdLine.split("(");
	var cmd = cmdAndParams[0], params = cmdAndParams[1];
	
	params = params.replace(")","");
	params = params.split(/[,|(\.\.\.)]+/);
	
	//validate number of parameters
	switch(cmd) {
	case "clearcell":
		paramCount = 2;
		if(params.length != paramCount) err=true;
		break;
	case "square":
	case "circle":
		paramCount = 3;
		if(params.length != paramCount) err=true;
		break;
	case "clearcells":
		paramCount = 4;
		if(params.length != paramCount) err=true;
		break;
	case "squares":
	case "circles":
	case "rectangle":
	case "line":
		paramCount = 5;
		if(params.length != paramCount) err=true;
		break;
	case "triangle":
		paramCount = 6;
		if(params.length != paramCount) err=true;
		break;
	case "lines":
		paramCount = 7;
		if(params.length != paramCount) err=true;
		break;
	case "triangles":
		paramCount = 8;
		if(params.length != paramCount) err=true;
		break;
	default:
		document.getElementById("err").innerHTML = "Unknown command.";
		return 0;
	}
	
	if(err) {
		document.getElementById("err").innerHTML = 
			"Invalid number of parameters (required " + paramCount + ", got "+ params.length + ").";
		return 0;
	}
	
	if(cmd.charAt(cmd.length-1) == "s" || cmd == "rectangle") {
		//validate position bounds
		var posBounds;
		if(cmd == "rectangle") {
			var p2 = new position(params[2] + "," + params[3]);
			p2.col += Number(params[0]) - 1;
			p2.row += Number(params[1]) - 1;
			posBounds = new positionBounds(params[0] + "," + params[1] + "..."
					+ p2.toString());
		}
		else posBounds = new positionBounds(
				params[0] + "," + params[1] + "..." +
				params[2] + "," + params[3]);
		
		if(!validateCellPositionBounds(posBounds) ) {
			document.getElementById("err").innerHTML = "Invalid position bounds.";
			return 0;
		}
	} else {
		//validate position
		if(!validateCellPosition(params[0], params[1]) ) {
			document.getElementById("err").innerHTML = "Invalid position.";
			return 0;
		}		
	}
	
	//validate color
	if(cmd.indexOf("clearcell") == -1) {
		if(!validateColor(params[params.length-1])) {
			document.getElementById("err").innerHTML = "Invalid color.";
			return 0;
		}		
	}
	
	//validate line
	if(cmd.indexOf("line") != -1) {
		var errCode;
		if(cmd == "line") errCode = validateLine(params[2].toLowerCase(), params[3].toLowerCase());
		else errCode = validateLine(params[4].toLowerCase(), params[5].toLowerCase());
		if(errCode == -1)
			document.getElementById("err").innerHTML = "Invalid points.";
		else if(errCode == -2)
			document.getElementById("err").innerHTML = "Invalid line (points are equal).";
		if(errCode < 0 ) return 0;
	}
	
	//validate triangle
	if(cmd.indexOf("triangle") != -1) {
		var i;
		
		if(cmd == "triangle") i = 2;
		else i = 4;
		
		if(	!validatePoint(params[i].toLowerCase() ) || 
			!validatePoint(params[i+1].toLowerCase() ) || 
			!validatePoint(params[i+2].toLowerCase() ) ) {
			document.getElementById("err").innerHTML = "Invalid points.";
			return 0;			
		} else if( !validateTriangle(params[i].toLowerCase(), params[i+1].toLowerCase(), params[i+2].toLowerCase() ) ) {
			document.getElementById("err").innerHTML = "Invalid triangle (area equals zero).";
			return 0;
		}
	}
	return 1;
}

function compareSVGs() {
	var user_svg_elements = $("#mosaics > *[id^='e']");
	var template_svg_elements = $("#mosaics-template > *[id^='te']");
	var template_child, user_child;
	
	// 1st check if counts of svg elements are equal
	if(template_svg_elements.length == user_svg_elements.length) {
		for(var i = 0; i < user_svg_elements.length; i++) {
			// get user svg element
			user_child = user_svg_elements.eq(i);
			// find corresponding template svg element
			template_child = $("#t" + user_child.attr("id"));
			if( template_child.get(0) != undefined ) {
				// 2nd check if counts of svg attributes are equal
				if( user_child.get(0).attributes.length ==
					template_child.get(0).attributes.length) {
					for(var j = 1; j < user_child.get(0).attributes.length; j++) {
						// 3rd check if attribute names and values are equal
						if( user_child.get(0).attributes[j].name !=
							template_child.get(0).attributes[j].name ||
							user_child.get(0).attributes[j].value !=
							template_child.get(0).attributes[j].value ) 
						{
							// attribute values and names are not equal
							return false;							
						}
					}
				}
			} else {
				// template has no element at the corresponding position
				// ==> number of elements are equal, positions are not equal
				return false;
			}
		}
		// element counts, id's (and therefore implicitly the positions)
		// and attribute names and values were equal
		return true;
	} else {
		// element counts were not equal 
		return false;
	}
}

