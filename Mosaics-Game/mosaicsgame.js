/**
 * 
 */

cellsize = 40;
bounds = [8,8];
validColors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", 
               "navy", "olive", "orange", "purple", "red", "silver", "teal", "yellow"];

function validateCellPosition(col,row)
{
	return (col>0 && col<=bounds[0] && row>0 && row <=bounds[1]);
}

function validateColor(color)
{
	return validColors.indexOf(color) != -1;
}

function validatePoint(p) {
	var validYParts = 	["t","c","b"];
	var validXParts = 	["l","c","r"];
	
	if(	(validYParts.indexOf(p[0]) != -1 && validXParts.indexOf(p[1]) != -1) ||
		(validYParts.indexOf(p[1]) != -1 && validXParts.indexOf(p[0]) != -1 ) )
		return true;
	else return false;
}
	
function setGridSize()
{	
	//Hide Radio Button
	//document.getElementById("GridSelect").style.visibility="hidden";
	
	
	//If drop down list is used
//	var selectedValue = document.getElementById("gridSelect").value;
//	document.getElementById("gridSelect").disabled = true;
	//End If
	
	//If radio buttons are used
	var gridSelect = document.getElementById("gridSelect");
	var selectedValue;
	for(var i=0 ; i < gridSelect.elements.length;i++) {
		gridSelect.elements.item(i).disabled = true;
		if(gridSelect.elements.item(i).checked) 
			selectedValue = gridSelect.elements.item(i).value;
	}
	//End If
		
	bounds = selectedValue.split("x");
	bounds[0] = Number(bounds[0]);
	bounds[1] = Number(bounds[1]);
	
	//Check count of Rows for cellsize
	if (bounds[0] > 12 || bounds[1] > 12) cellsize=20
	else cellsize=40;
		
//	bounds[0] = col;
//	bounds[1] = row;
	
	var strValidColors = "";
	for(var i = 0; i < validColors.length; i++)
		strValidColors += "<span style=color:"+validColors[i]+">"+validColors[i]+"</span>"+", ";
	document.getElementById("clrs").innerHTML = 
		"Verf&uumlgbare Farben: <br>" + strValidColors;
	
	//Set SVG-Canvas attributes
	var svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute("width",cellsize*(Number(bounds[0])+1)+2);
	svg.setAttribute("height",cellsize*(Number(bounds[1])+1)+2);

	//Set pattern attributes
	var pattern = svg.getElementById("pattern1");
	pattern.setAttribute("width",cellsize);
	pattern.setAttribute("height",cellsize);
	var vline = svg.getElementById("vline");
	vline.setAttribute("y2",cellsize);	
	var hline = svg.getElementById("hline");
	hline.setAttribute("x2",cellsize);
		
	//Set bounding rect attributes
	var rect = svg.getElementsByTagName("rect")[0];
	rect.setAttribute("x",cellsize);
	rect.setAttribute("y",cellsize);
	rect.setAttribute("width",cellsize*bounds[0]+2);
	rect.setAttribute("height",cellsize*bounds[1]+2);
	
	//Iterate Grid Numbers
	var number;
	var pos;
	for(var i = 0 ; i<bounds[0];i++)
	{
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(i+1, 0);
		number.setAttribute("id", "n"+(i+1)+0);
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.7);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	}
	for(var i = 0 ; i<bounds[1];i++)
	{
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(0,i+1);
		number.setAttribute("id", "n"+0+(i+1));
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.7);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	}
	
	//GridSizeNumber
//	index = document.createElementNS("http://www.w3.org/2000/svg", "text");
//	index.setAttribute("id", "index");
//	pos = cellToPos(bounds[0],bounds[1]);
//	index.setAttribute("x", 10);
//	index.setAttribute("y", 15);
//	index.setAttribute("style","font-size:10px");
//	index.setAttribute("style","fill:red");
//	index.setAttribute("text-anchor","right");
//	index.appendChild(document.createTextNode(bounds[0] +" x "  + bounds[1]));
//	svg.appendChild(index);
//	
}
	
function test() {
	
//	var defs = svg.getElementsByTagName("defs")[0];
	
}

function cellToPos(col, row) {
	return [col*cellsize,row*cellsize];
}

function pointOffset(p) {
	var validYParts = 	["t","c","b"];
	var validXParts = 	["l","c","r"];
	var offsets = 		[ 2, cellsize/2, cellsize ];
	var pOffset = 		[0,0];
	
	if(p=="cc") pOffset = [offsets[1],offsets[1]];
	else if(validYParts.indexOf(p[0]) != -1 && validXParts.indexOf(p[1]) != -1 ) {
		pOffset[0] = offsets[validXParts.indexOf(p[1])];
		pOffset[1] = offsets[validYParts.indexOf(p[0])];
	} else if(validYParts.indexOf(p[1]) != -1 && validXParts.indexOf(p[0]) != -1 ) {
		pOffset[0] = offsets[validXParts.indexOf(p[0])];
		pOffset[1] = offsets[validYParts.indexOf(p[1])];
	}
	return pOffset;
}

function line(col, row, p1, p2, clr) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var element = document.createElementNS("http://www.w3.org/2000/svg", "line");
    var pos = cellToPos(col, row);
    
    p1Offset = pointOffset(p1);
    p2Offset = pointOffset(p2);
	
    element.setAttribute("id", "e"+col+row);
    element.setAttribute("x1",p1Offset[0] + pos[0]);
    element.setAttribute("y1",p1Offset[1] + pos[1]);
    element.setAttribute("x2",p2Offset[0] + pos[0]);
    element.setAttribute("y2",p2Offset[1] + pos[1]);
//    element.setAttribute("fill",clr);
    element.style.stroke = clr;
    element.style.strokeWidth = 2;
    root.appendChild(element);
}

function circle(col,row, clr) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var pos = cellToPos(col, row);
    element.setAttribute("id", "e"+col+row);
    element.setAttribute("r",cellsize/2 - 1);
    element.setAttribute("cx",cellsize/2 + 1 + pos[0]);
    element.setAttribute("cy",cellsize/2 + 1 + pos[1]);
//    element.setAttribute("fill",clr);
    element.style.fill = clr;
    root.appendChild(element);
}

function square(col,row,clr) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    var pos = cellToPos(col, row);
    element.setAttribute("id", "e"+col+row);
    element.setAttribute("x",pos[0]+2);
    element.setAttribute("y",pos[1]+2);
    element.setAttribute("width",cellsize-2);
    element.setAttribute("height",cellsize-2);
//    element.setAttribute("fill",clr);
    element.style.fill = clr;
    root.appendChild(element);
}

function rectangle(col,row, width, height,clr) {
    for(var i=0;i<height;i++)
    {
    	for(var j=0;j<width;j++)
    	{
    		square(col+j,row+i,clr);   		
    	}
    }
}

function draw(form){
	if(document.getElementById("err").innerHTML.length > 0) document.getElementById("err").innerHTML = "";
	var cmd = form.cmd.value.split("(");
	if(cmd.length == 2)
	{
		var params = cmd[1].split(",");
		if(params[params.length-1].indexOf(")") == -1)
			document.getElementById("err").innerHTML = "Schlie&szligende Klammer fehlt.";			
		else if(!validateCellPosition(params[0], params[1])) {
			document.getElementById("err").innerHTML = "Ung&uumlltige Position.";
		} else {
			params[params.length-1] = params[params.length-1].replace(")","");
			if(cmd[0] == "line") {
				if(params.length == 5) {
					if(validatePoint( params[2].toLowerCase() ) && validatePoint( params[3].toLowerCase() ) ) {
						if(validateColor(params[4]))
							line(params[0],params[1],params[2].toLowerCase(),params[3].toLowerCase(),params[4]);
						else document.getElementById("err").innerHTML = "Ung&uumlltige Farbe.";						
					} else document.getElementById("err").innerHTML = "Ung&uumlltige Punkte.";
				}
				else document.getElementById("err").innerHTML = "Parameteranzahl ung&uumlltig (3 erwartet, "+params.length+" bekommen).";
			}
			if(cmd[0] == "square" ) {
				if(params.length == 3) {
					if(validateColor(params[2]))
						square(params[0],params[1],params[2]);
					else document.getElementById("err").innerHTML = "Ung&uumlltige Farbe.";
				}
				else document.getElementById("err").innerHTML = "Parameteranzahl ung&uumlltig (3 erwartet, "+params.length+" bekommen).";
			} 
			else if(cmd[0] == "circle" ) 
				if(params.length == 3) {
					if(validateColor(params[2]))
						circle(Number(params[0]),Number(params[1]),params[2]);
					else document.getElementById("err").innerHTML = "Ung&uumlltige Farbe.";
				} else document.getElementById("err").innerHTML = "Parameteranzahl ung&uumlltig (3 erwartet, "+params.length+" bekommen).";
			else if(cmd[0] == "rectangle" )
			{
				if(params.length == 5) {
					if(validateCellPosition(Number(params[0])+Number(params[2])-1, Number(params[1])+Number(params[3])-1)) {
						if(validateColor(params[4]))
							rectangle(Number(params[0]),Number(params[1]),Number(params[2]),Number(params[3]),params[4]);
						else document.getElementById("err").innerHTML = "Ung&uumlltige Farbe.";
					} else document.getElementById("err").innerHTML = "Fl&aumlche &uumlberschreitet Bildgrenze."; 				
				} else document.getElementById("err").innerHTML = "Parameteranzahl ung&uumlltig (5 erwartet, "+params.length+" bekommen).";
			}			
		}
	} else document.getElementById("err").innerHTML = "&Oumlffnende Klammer fehlt.";

    return false;
}



//SAVE
function save(){

    // Get the d3js SVG element

    var svg = document.getElementsByTagName("svg")[0];


    // Extract the data as SVG text string
    var svg_xml = new XMLSerializer().serializeToString(svg);
    
    //PRETIFY will noch nicht ganz so
    //var svg_xml_beauty = new vkbeautify.xmlmin(svg_xml);
    //console.log(svg_xml_beauty);
    var textFileAsBlob = new Blob([svg_xml], {type:'image/svg+xml'});
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}
