/**
 * 
 */

cellsize = 40;
bounds = [8,8];

function insideBounds(col,row)
{
	return (col>0 && col<=bounds[0] && row>0 && row <=bounds[1]);
}
	
function test() {
	var svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute("width",cellsize*(bounds[0]+1));
	svg.setAttribute("height",cellsize*(bounds[0]+1));
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
	rect.setAttribute("width",cellsize*bounds[0]);
	rect.setAttribute("height",cellsize*bounds[0]);
	var number;
	var pos;
	for(var i = 0 ; i<bounds[0];i++)
	{
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(i+2, 1);
		number.setAttribute("id", "n"+(i+1)+0);
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.6);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	    
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(1,i+2);
		number.setAttribute("id", "n"+0+(i+1));
	    number.setAttribute("x",pos[0]+cellsize/2);
	    number.setAttribute("y",pos[1]+cellsize*0.6);
	    number.setAttribute("text-anchor","middle");
	    number.appendChild(document.createTextNode(i+1));
	    svg.appendChild(number);
	}
	
}

function cellToPos(col, row) {
	return [(col-1)*cellsize,(row-1)*cellsize];
}

function circle(col,row) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var pos = cellToPos(col, row);
    circle.setAttribute("id", "e"+col+row);
    circle.setAttribute("r",19);
    circle.setAttribute("cx",20.5 + pos[0]);
    circle.setAttribute("cy",20.5 + pos[1]);
    circle.setAttribute("fill","blue");
    root.appendChild(circle);
}

function square(col,row) {
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    var element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    var pos = cellToPos(col, row);
    element.setAttribute("id", "e"+col+row);
    element.setAttribute("x",pos[0]);
    element.setAttribute("y",pos[1]);
    element.setAttribute("width",cellsize);
    element.setAttribute("height",cellsize);
    element.setAttribute("fill","red");
    root.appendChild(element);
}
function rectangle(col,row, width, height) {
	if(!insideBounds(col, row)) return -1;
	if(!insideBounds(col+width, row+height)) return -2;
    var root = document.getElementsByTagName("svg")[0];
    var child = root.getElementById("e"+col+row);
    if(child) root.removeChild(child);
    for(var i=0;i<height;i++)
    {
    	for(var j=0;j<width;j++)
    	{
    		var element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    		var pos = cellToPos(col+j, row+i);
    		element.setAttribute("id", "e"+(col+j)+(row+i));
    		element.setAttribute("x",pos[0]+1);
    		element.setAttribute("y",pos[1]+1);
    		element.setAttribute("width",cellsize-1);
    		element.setAttribute("height",cellsize-1);
    		element.setAttribute("fill","green");
    		root.appendChild(element);    		
    	}
    }
    return 1;
}

function draw(form){
	var cmd = form.cmd.value.split("(");
	if(cmd.length == 2)
	{
		var params = cmd[1].split(",");
		params[params.length-1] = params[params.length-1].replace(")","");
		if(cmd[0] == "square" && params.length == 2 ) 
			square(Number(params[0])+1,Number(params[1])+1);
		else if(cmd[0]=="circle" && params.length == 2) 
			circle(Number(params[0])+1,Number(params[1])+1);
		else if(cmd[0]=="rectangle" && params.length == 4)
		{
			var res = rectangle(Number(params[0])+1,Number(params[1])+1,Number(params[2]),Number(params[3]));
			if(res == -1) document.getElementById("err").innerHTML = "Ung&uumlltige Position.";
			else if( res == -2) document.getElementById("err").innerHTML = "Fl&aumlche &uumlberschreitet Bildgrenze.";
		}
	}

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
