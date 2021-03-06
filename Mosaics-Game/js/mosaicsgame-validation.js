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
			return undefined;
		else return "Invalid line (points are equal).";
	} else return "Invalid points.";
}

function vector(point) {
	if(point != null) {
		this.x = point[0];
		this.y = point[1];		
	} else {
		this.x = 0;
		this.y = 0;
	}
	
	this.sub = function(v) {
		var ret = new vector();
		ret.x = this.x - v.x;
		ret.y = this.y - v.y;
		return ret;
	};
}

function validateTriangle(p1,p2,p3) {
	var p1o = pointOffset(p1), p2o = pointOffset(p2), p3o = pointOffset(p3);
	var p1v = new vector(p1o), p2v = new vector(p2o), p3v = new vector(p3o);
	var a = p1v.sub(p2v), b = p1v.sub(p3v);

	return (a.x*b.y-a.y*b.x != 0);
}

function requiredParamCountForCmd(cmd) {
	switch(cmd) {
		case "clearcell":	return 2;
		
		case "square":
		case "circle":		return 3;
		
		case "rectangle":
		case "line":		return 5;
		
		case "triangle":	return 6;
		
		default:			return -1;
	}
}

function validateCmdName(cmd) {
	return (requiredParamCountForCmd(cmd) != -1);
}

function validateNumberOfParams(cmd, params) {
	var paramCount = requiredParamCountForCmd(cmd);
	
	if($("#color_dropdown").val() != "(None)" &&
			params.length == paramCount-1)
		return true;

	if(params.length != paramCount)
		return false;

	return true;
}

function validatePositionParams(cmd, params) {
	var posRanges;
	
	if(cmd == "rectangle") posRanges = rectangleRanges(params);
	else posRanges = new positionRanges(params[0],params[1]);
	
	var errMsg = posRanges.validate();
	
	if(errMsg) {
		$("#err").html(errMsg);
		return false;
	}

	return true;
}

function validateLineParams(cmd, params) {
	if(cmd.indexOf("line") != -1) {
		var errMsg = validateLine(params[2].toLowerCase(), params[3].toLowerCase());
		
		if(errMsg) {
			$("#err").html(errMsg);
			return false;
		}
	}
	return true;
}

function validateTriangleParams(cmd, params) {
	if(cmd.indexOf("triangle") != -1) {
		var i = 2;
		
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
	
	params = params.replace(")","").split(",");
	
	if(!validatePositionParams(cmd, params)) return 0;
	
	if(!validateLineParams(cmd, params)) return 0;
	
	if(!validateTriangleParams(cmd, params)) return 0;
	
	if(!validateColorParam(cmd, params)) return 0;

	return 1;
}

function validateSvgLine(userChild, templateChild) {
	if( userChild.attr("style") != templateChild.attr("style") )
		return false;

	var xy = "xy", swapped, isValid = false;
	for( var i = 0; i < 2; i++ ) {
		if(swapped == false || swapped == undefined) {
			if( userChild.attr(xy[i]+"1") == templateChild.attr(xy[i]+"1") &&
				userChild.attr(xy[i]+"2") == templateChild.attr(xy[i]+"2") ) {
				swapped = false;
				isValid = true;
			} else isValid = false;
		}
		if (swapped == true || swapped == undefined) {
			if( userChild.attr(xy[i]+"1") == templateChild.attr(xy[i]+"2") &&
				userChild.attr(xy[i]+"2") == templateChild.attr(xy[i]+"1") ) {
				swapped = true;
				isValid = true;
			} else isValid = false;
		}
	}
	
	return isValid;
}

function validateSvgPoints(userChildPointAttr, templateChild) {
	var user_points, template_points;
	
	user_points = userChildPointAttr.value.split(" ");
	template_points = templateChild.attr("points");
	
	for( var k = 0; k < user_points.length; k++ ) {
		if(template_points.indexOf(user_points[k]) == -1)
			return false;
	}
	return true;
}

function compareSVGs() {
	var userSvgElements = $("#mosaics > *[id^='e']");
	var templateSvgElements = $("#mosaics-template > *[id^='te']");
	var templateChild, userChild, userChildAttrs;
	
	// 1st check if counts of svg elements are equal
	if(templateSvgElements.length == userSvgElements.length &&
			templateSvgElements.length != 0) {
		for( var i = 0; i < userSvgElements.length; i++ ) {
			// get user svg element
			userChild = userSvgElements.eq(i);
			// find corresponding template svg element
			templateChild = $("#t" + userChild.attr("id"));
			if( templateChild.get(0) != undefined ) {
				userChildAttrs = userChild.get(0).attributes;
				// 2nd check if counts of svg attributes are equal
				if( userChildAttrs.length == templateChild.get(0).attributes.length) {
					if(templateChild.get(0).nodeName == "line") {
						if(!validateSvgLine(userChild,templateChild))
							return false;
					} else {
						for( var j = 0; j < userChildAttrs.length; j++ ) {
							// 3rd check if attribute names and values are equal
							if( userChildAttrs[j].name == "id") continue;
							else if(userChildAttrs[j].name == "points") {
								if(!validateSvgPoints(userChildAttrs[j],templateChild))
									return false;
							} else {
								if( userChildAttrs[j].value !=
									templateChild.attr(userChildAttrs[j].name) ) 
								{
									// attribute values and names are not equal
									return false;							
								}
							}
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

