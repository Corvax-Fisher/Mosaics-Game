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
	
function init() {
	var strValidColors = "";
	for(var i = 0; i < validColors.length; i++)
		strValidColors += "<span style=color:"+validColors[i]+">"+validColors[i]+"</span>"+", ";
	document.getElementById("clrs").innerHTML = 
		"Verf&uumlgbare Farben: <br>" + strValidColors;
	var svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute("width",cellsize*(bounds[0]+1)+2);
	svg.setAttribute("height",cellsize*(bounds[0]+1)+2);
//	var defs = svg.getElementsByTagName("defs")[0];
	var pattern = svg.getElementById("pattern1");
	pattern.setAttribute("width",cellsize);
	pattern.setAttribute("height",cellsize);
	var vline = svg.getElementById("vline");
	vline.setAttribute("y2",cellsize);	
	var hline = svg.getElementById("hline");
	hline.setAttribute("x2",cellsize);
	var rect = svg.getElementsByTagName("rect")[0];
	rect.setAttribute("x",cellsize);
	rect.setAttribute("y",cellsize);
	rect.setAttribute("width",cellsize*bounds[0]+2);
	rect.setAttribute("height",cellsize*bounds[0]+2);
	var number;
	var pos;
	for(var i = 0 ; i<bounds[0];i++)
	{
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(i+1, 0);
		number.setAttribute("id", "n"+(i+1)+0);
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.6);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	    
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(0,i+1);
		number.setAttribute("id", "n"+0+(i+1));
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.6);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	}
	
}

function cellToPos(col, row) {
	return [col*cellsize,row*cellsize];
}

function circle(col,row, clr) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var pos = cellToPos(col, row);
    circle.setAttribute("id", "e"+col+row);
    circle.setAttribute("r",19);
    circle.setAttribute("cx",21 + pos[0]);
    circle.setAttribute("cy",21 + pos[1]);
    circle.setAttribute("fill",clr);
    root.appendChild(circle);
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
    element.setAttribute("fill",clr);
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

function generateLabel(){
	
	var x_cell_size = bounds[0];
	var root = document.getElementsByTagName("svg")[0];
	
	
	for (i=1; i <= x_cell_size; i++ ){
		 var element = document.createElementNS("http://www.w3.org/2000/svg", "text");
		 var pos_y = cellsize/2;
		 var pos_x = i * cellsize + cellsize/2;
		 element.setAttribute("id", "label_x" + i );
		 element.setAttribute("x",pos_x);
		 element.setAttribute("y",pos_y);
		 element.textContent = i;
		 root.appendChild(element);
	}
	
	for (i=1; i <= x_cell_size; i++ ){
		 var element = document.createElementNS("http://www.w3.org/2000/svg", "text");
		 var pos_y = i * cellsize + cellsize/2;
		 var pos_x = cellsize/2;
		 element.setAttribute("id", "label_y" + i );
		 element.setAttribute("x",pos_x);
		 element.setAttribute("y",pos_y);
		 element.textContent = i;
		 root.appendChild(element);
	}
	
	
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
    var textFileAsBlob = new Blob([svg_xml], {type:'text/plain'});
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
