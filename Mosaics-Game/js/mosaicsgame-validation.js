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

function requiredParamCountForCmd(cmd) {
	switch(cmd) {
		case "clearcell":	return 2;
		
		case "square":
		case "circle":		return 3;
		
		case "clearcells":	return 4;
		
		case "squares":
		case "circles":
		case "rectangle":
		case "line":		return 5;
		
		case "triangle":	return 6;
		
		case "lines":		return 7;
		
		case "triangles":	return 8;
		default:			return -1;
	}
}

function validateNumberOfParams(cmd, params) {
	var paramCount = requiredParamCountForCmd(cmd);
	
	if(paramCount == -1) {
		$("#err").html("Unknown command.");
		return false;		
	}
	
	if($("#color_dropdown").val() != "(None)" &&
			params.length == paramCount-1)
		return true;
	
	if(params.length != paramCount) {
		$("#err").html("Invalid number of parameters (required " + 
				paramCount + ", got "+ params.length + ").");
		return false;
	}
	
	return true;
}

function validatePositionParams(cmd, params) {
	if(cmd.charAt(cmd.length-1) == "s" || cmd == "rectangle") {
		//validate position bounds
		var posBounds;
		if(cmd == "rectangle") 
			posBounds = rectangleBounds(params);
		else posBounds = new positionBounds(
				params[0] + "," + params[1] + "..." +
				params[2] + "," + params[3]);
		
		if(!validateCellPositionBounds(posBounds) ) {
			$("#err").html("Invalid position bounds.");
			return false;
		}
	} else {
		//validate position
		if(!validateCellPosition(params[0], params[1]) ) {
			$("#err").html("Invalid position.");
			return false;
		}		
	}
	return true;
}

function validateLineParams(cmd, params) {
	if(cmd.indexOf("line") != -1) {
		var errCode;
		if(cmd == "line") errCode = validateLine(params[2].toLowerCase(), params[3].toLowerCase());
		else errCode = validateLine(params[4].toLowerCase(), params[5].toLowerCase());
		
		if(errCode == -1) $("#err").html("Invalid points.");
		else if(errCode == -2) $("#err").html("Invalid line (points are equal).");
		
		if(errCode < 0 ) return false;
	}
	return true;
}

function validateTriangleParams(cmd, params) {
	if(cmd.indexOf("triangle") != -1) {
		var i;
		
		if(cmd == "triangle") i = 2;
		else i = 4;
		
		if(	!validatePoint(params[i].toLowerCase() ) || 
			!validatePoint(params[i+1].toLowerCase() ) || 
			!validatePoint(params[i+2].toLowerCase() ) ) {
			$("#err").html("Invalid points.");
			return false;			
		} else if( !validateTriangle(params[i].toLowerCase(), params[i+1].toLowerCase(), params[i+2].toLowerCase() ) ) {
			$("#err").html("Invalid triangle (area equals zero).");
			return false;
		}
	}
	return true;
}

function validateColorParam(cmd, params) {
	if(cmd.indexOf("clearcell") == -1 && params.length == requiredParamCountForCmd(cmd)) {
		if(!validateColor(params[params.length-1])) {
			$("#err").html("Invalid color.");
			return false;
		}		
	}
	return true;
}

function validateParameters(cmdLine) {
	var cmdAndParams = cmdLine.split("(");
	var cmd = cmdAndParams[0], params = cmdAndParams[1];
	
	params = params.replace(")","");
	params = params.split(/,|\.\.\./);
	
	if(!validateNumberOfParams(cmd, params)) return 0;
	
	if(!validatePositionParams(cmd, params)) return 0;
	
	if(!validateLineParams(cmd, params)) return 0;
	
	if(!validateTriangleParams(cmd, params)) return 0;
	
	if(!validateColorParam(cmd, params)) return 0;

	return 1;
}

function compareSVGs() {
	var user_svg_elements = $("#mosaics > *[id^='e']");
	var template_svg_elements = $("#mosaics-template > *[id^='te']");
	var template_child, user_child;
	
	// 1st check if counts of svg elements are equal
	if(template_svg_elements.length == user_svg_elements.length &&
			template_svg_elements.length != 0) {
		for(var i = 0; i < user_svg_elements.length; i++) {
			// get user svg element
			user_child = user_svg_elements.eq(i);
			// find corresponding template svg element
			template_child = $("#t" + user_child.attr("id"));
			if( template_child.get(0) != undefined ) {
				// 2nd check if counts of svg attributes are equal
				if( user_child.get(0).attributes.length ==
					template_child.get(0).attributes.length) {
					for(var j = 0; j < user_child.get(0).attributes.length; j++) {
						if( user_child.get(0).attributes[j].name == "id") continue;
						// 3rd check if attribute names and values are equal
						if( user_child.get(0).attributes[j].value !=
							template_child.attr(user_child.get(0).attributes[j].name) ) 
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

