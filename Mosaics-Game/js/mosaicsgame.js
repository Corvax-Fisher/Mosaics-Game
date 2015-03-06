/**
 * main mosaics game library
 */

//globals
cellsize = 40;
bounds = [ 8, 8 ];
validColors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime",
               "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal",
               "yellow" ];
var availableCmds = ["circle","circles","line","lines","rectangle","square","squares","triangle","triangles"];

colorToRGB = {	"aqua" 		: "rgb(0, 255, 255)", 
				"black" 	: "rgb(0, 0, 0)", 
				"blue" 		: "rgb(0, 0, 255)", 
				"fuchsia"	: "rgb(255, 0, 255)", 
				"gray"		: "rgb(128, 128, 128)", 
				"green"		: "rgb(0, 128, 0)", 
				"lime"		: "rgb(0, 255, 0)",
				"maroon"	: "rgb(128, 0, 0)", 
				"navy"		: "rgb(0, 0, 128)", 
				"olive"		: "rgb(128, 128, 0)", 
				"orange"	: "rgb(255, 165, 0)", 
				"purple"	: "rgb(128, 0, 128)", 
				"red"		: "rgb(255, 0, 0)", 
				"silver"	: "rgb(192, 192, 192)", 
				"teal"		: "rgb(0, 128, 128)",
				"yellow" 	: "rgb(255, 255, 0)"};

undoHistory = [];
redoHistory = [];
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
elementHistory = [];

function setGridSize() {

	document.getElementById("okBtn").disabled = false;
	// Hide Radio Button
	// document.getElementById("GridSelect").style.visibility="hidden";

	// If drop down list is used
	// var selectedValue = document.getElementById("gridSelect").value;
	// document.getElementById("gridSelect").disabled = true;
	// End If

	// If radio buttons are used
	var gridSelect = document.getElementById("gridSelect");
	var selectedValue = "";
	for (var i = 0; i < gridSelect.elements.length; i++) {
		// gridSelect.elements.item(i).disabled = true;
		if (gridSelect.elements.item(i).checked)
			selectedValue = gridSelect.elements.item(i).value;
	}
	// End If

	bounds = selectedValue.split("x");
	bounds[0] = Number(bounds[0]);
	bounds[1] = Number(bounds[1]);

	// Check count of Rows for cellsize
	if (bounds[0] > 12 || bounds[1] > 12)
		cellsize = 20;
	else
		cellsize = 40;

	// bounds[0] = col;
	// bounds[1] = row;

	// Set SVG-Canvas attributes
	var svg = document.getElementsByTagName("svg")[0];
	svg.setAttribute("width", cellsize * (Number(bounds[0]) + 1) + 2);
	svg.setAttribute("height", cellsize * (Number(bounds[1]) + 1) + 2);
	svg.setAttribute("viewBox", "0 0 " + (cellsize * (Number(bounds[0]) + 1) + 2) + " " + (cellsize * (Number(bounds[1]) + 1) + 2));

	// Set pattern attributes
	var pattern = svg.getElementById("pattern1");
	pattern.setAttribute("width", cellsize);
	pattern.setAttribute("height", cellsize);
	var vline = svg.getElementById("vline");
	vline.setAttribute("y2", cellsize);
	var hline = svg.getElementById("hline");
	hline.setAttribute("x2", cellsize);

	// Set bounding rect attributes
	var rect = svg.getElementsByTagName("rect")[0];
	rect.setAttribute("x", cellsize);
	rect.setAttribute("y", cellsize);
	rect.setAttribute("width", cellsize * bounds[0] + 2);
	rect.setAttribute("height", cellsize * bounds[1] + 2);

	// GridSizeNumber
	// index = document.createElementNS("http://www.w3.org/2000/svg", "text");
	// index.setAttribute("id", "index");
	// pos = cellToPos(bounds[0],bounds[1]);
	// index.setAttribute("x", 10);
	// index.setAttribute("y", 15);
	// index.setAttribute("style","font-size:10px");
	// index.setAttribute("style","fill:red");
	// index.setAttribute("text-anchor","right");
	// index.appendChild(document.createTextNode(bounds[0] +" x " + bounds[1]));
	// svg.appendChild(index);

}

function gridSizeOk() {
	// Disable radio buttons
	var gridSelect = document.getElementById("gridSelect");
	for (var i = 0; i < gridSelect.elements.length; i++) {
		gridSelect.elements.item(i).disabled = true;
	}

	// Change Grid Color
	document.getElementById("hline").style.stroke = "black";
	document.getElementById("vline").style.stroke = "black";

	document.getElementById("okBtn").disabled = true;
	enableAndDisableElements(false);

	var jumbotronArray = document.getElementsByClassName("jumbotron");
	var i;
	jumbotronArray[0].style.border = "";
	for (i = 1; i < jumbotronArray.length; i++) {
		jumbotronArray[i].style.backgroundColor = "#EEEEEE";
	}

	// Iterate Grid Numbers
	var svg = document.getElementsByTagName("svg")[0];
	var number;
	var pos;
	for (var i = 0; i < bounds[0]; i++) {
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(i + 1, 0);
		number.setAttribute("id", "n" + (i + 1) + 0);
		number.setAttribute("x", pos[0] + cellsize / 2);
		number.setAttribute("y", pos[1] + cellsize * 0.7);
		number.setAttribute("text-anchor", "middle");
		number.appendChild(document.createTextNode(i + 1));
		svg.appendChild(number);
	}
	for (var i = 0; i < bounds[1]; i++) {
		number = document.createElementNS("http://www.w3.org/2000/svg", "text");
		pos = cellToPos(0, i + 1);
		number.setAttribute("id", "n" + 0 + (i + 1));
		number.setAttribute("x", pos[0] + cellsize / 2);
		number.setAttribute("y", pos[1] + cellsize * 0.7);
		number.setAttribute("text-anchor", "middle");
		number.appendChild(document.createTextNode(i + 1));
		svg.appendChild(number);
	}

	$("#cmdLine").focus();
	$('html, body').animate({
		scrollTop : ($('#editorCmd').offset().top)
	}, 'slow');
}

function executeCommand(cmdName, cmdParams) {
	switch (cmdName) {
	case "clearcell":
		deleteElement( new position(cmdParams[0] +"," + cmdParams[1]), true );
		break;
	case "square":
		square(cmdParams[0], cmdParams[1], cmdParams[2]);
		break;
	case "circle":
		circle(Number(cmdParams[0]), Number(cmdParams[1]), cmdParams[2]);
		break;
	case "rectangle":
		rectangle(Number(cmdParams[0]), Number(cmdParams[1]),
				Number(cmdParams[2]), Number(cmdParams[3]), cmdParams[4]);
		break;
	case "line":
		line(cmdParams[0], cmdParams[1], cmdParams[2].toLowerCase(),
				cmdParams[3].toLowerCase(), cmdParams[4]);
		break;
	case "triangle":
		triangle(cmdParams[0], cmdParams[1], cmdParams[2].toLowerCase(),
				cmdParams[3].toLowerCase(), cmdParams[4].toLowerCase(),
				cmdParams[5]);
		break;
	case "clearcells":
		deleteElements( new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), true );
		break;
	case "squares":
		squares(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3]);
		break;
	case "circles":
		circles(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3]);
		break;
	case "lines":
		lines(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3].toLowerCase(), cmdParams[4]
		.toLowerCase(), cmdParams[5]);
		break;
	case "triangles":
		triangles(new positionBounds(cmdParams[0] + "," + cmdParams[1] + ","
				+ cmdParams[2]), cmdParams[3].toLowerCase(), cmdParams[4]
		.toLowerCase(), cmdParams[5].toLowerCase(), cmdParams[6]);
		break;
	}
}

function draw(form) {
	if (document.getElementById("err").innerHTML.length > 0)
		document.getElementById("err").innerHTML = "";

	var cmd = form.cmd.value.split("(");
	if (cmd.length == 2) {
		var params = cmd[1].split(",");
		if (params[params.length - 1].indexOf(")") == -1)
			document.getElementById("err").innerHTML = "Closing bracket is missing.";
		else {
			params[params.length - 1] = params[params.length - 1].replace(")",
			"");
			if (validateParameters(cmd[0], params)) {
				executeCommand(cmd[0], params);
				manageHistory(form.cmd.value);
				if(compareSVGs()) $("#err").html("You won!");				
			}
		}
	} else
		document.getElementById("err").innerHTML = "Opening bracket is missing.";

	if (document.getElementById("err").innerHTML.length > 0) {
		document.getElementById("messages").style.display = "block";
	} else {
		document.getElementById("messages").style.display = "none";
	}

	$('#history').scrollTop($('#history')[0].scrollHeight);

	return false;
}

$(function() {
	bindDropdownClickFunction();
	
	if (filename == "index.html") {
		enableAndDisableElements(true);

		var jumbotronArray = document.getElementsByClassName("jumbotron");
		jumbotronArray[0].style.border = "thick solid black";

		// read syntax.xml and show in syntax catalog
		readXMLAndShowSyntaxCatalog();

		// show the colors available in the div
		showExtraColors();

		//autocomplete the commands for user friendly blub
		autocompleteCommands();
	} else if (filename = "game.html") {
		var cvalue = "All categories";
		var lvalue = "All levels";
		readXMLandShowPatternCatalog(cvalue,lvalue)
	}
});

//split value for autocomplete
function split(val) {
	return val.split(/,\s*/);
}

//SAVE
function save() {
	var err = false;

	if (undoHistory.length == 0) {
		document.getElementById("save_err").innerHTML = "Please draw something first";
		err = true;
	} else if (document.getElementById("inputFileNameToSaveAs").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose name";
		err = true;
	} else if (document.getElementById("category_dropdown").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose category";
		err = true;
	} else if (document.getElementById("dif_dropdown").value == "") {
		document.getElementById("save_err").innerHTML = "Please choose difficulty";
		err = true;
	}

	if (err == true) {
		document.getElementById("save_messages").style.display = "block";
		window.scrollTo(0, document.body.scrollHeight);
		return false;
	}

	var svg = document.getElementsByTagName("svg")[0];

	// Extract the data as SVG text string
	var svg_xml = new XMLSerializer().serializeToString(svg);

	
	// Jquery AJAX
	$.ajax({

		type : 'POST',
		url : 'php/EDIT_SVG_index.php',
		data : {
			'name' : $("#inputFileNameToSaveAs").val(),
			'category' : $("#category_dropdown").val(),
			'dif' : $("#dif_dropdown").val(),
			'width' : bounds[0],
			'length' : bounds[1],
			'svg_xml' : svg_xml
		},

		success : function(response) {
			document.getElementById("save_messages").style.display = "block";
			$("#save_err").text(response);
			if (response == "saved"){
				setTimeout(function(){
					   window.location.reload(1);
					}, 5000);
			} 
		}

	});

	return false;
}



function enableAndDisableElements(bool) {
	var elements = [ "resetBtn", "cmdLine", "cmdBtn", "inputFileNameToSaveAs",
	                 "category_dropdown", "dif_dropdown", "saveBtn" ];
	var i;

	for (i = 0; i < elements.length; i++) {
		document.getElementById(elements[i]).disabled = bool;
	}

}

function readXMLAndShowSyntaxCatalog() {
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","xml/syntax.xml",false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;
	var x=xmlDoc.getElementsByTagName("syntax");
	
	for (var i=0;i<x.length;i++) {
		$("#accordion").append(
				"<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading"
				+ i
				+ "'><h4 class='panel-title'><a data-toggle='collapse' data-parent='#accordion' href='#collapse"
				+ i
				+ "' aria-expanded='false' aria-controls='collapse"
				+ i
				+ "'>"
				+ x[i].getElementsByTagName('command')[0].childNodes[0].nodeValue
				+ "</a></h4></div><div id='collapse"
				+ i
				+ "' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"
				+ i
				+ "'><div class='panel-body'>"
				+ x[i].getElementsByTagName('description')[0].childNodes[0].nodeValue
				+ "</div></div></div>");

	}
}

function readXMLandShowPatternCatalog(cvalue,lvalue) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "SVG_index.xml", false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	var y = xmlDoc.getElementsByTagName("SVG");

	$("#myCarousel").html("<ol class='carousel-indicators'></ol><div class='carousel-inner'"
			+" role='listbox'></div><a class='left carousel-control'" 
			+" href='#myCarousel' role='button' data-slide='prev'> "
			+ "<span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>"
			+"<span class='sr-only'>Previous</span>"			
			+"</a> <a class='right carousel-control' href='#myCarousel' role='button' "		
			+" data-slide='next'> <span "
			+"class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>"
			+"<span class='sr-only'>Next</span></a>");

	if (cvalue == "All categories" && lvalue == "All levels"){
		for (i = 0; i < y.length; i++) {
			if (i%4 == 0) {
				$(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='"+i+"'></li>");
				$(".carousel-inner").append("<div class='item'><div class='container'><div class='carousel-caption'><div class='row'></div></div></div></div>");
			}

			$(".carousel-caption .row:last").append(
					"<div class='col-md-3'><img src='svgs/thumbnails/"
					+ y[i].getAttribute('Filename')
					+ "' alt=''><p>" 
					+ y[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue 
					+ "/ " 
					+ y[i].getElementsByTagName('Category')[0].childNodes[0].nodeValue 
					+ "/ " 
					+ y[i].getElementsByTagName('Dif')[0].childNodes[0].nodeValue 
					+ "</p></div>");
		}
	} else if (cvalue != "All categories" || lvalue != "All levels"){
		
		var z = 0;
		
		for (i = 0; i < y.length; i++) {
			if (i%4 == 0) {
				$(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='"+z+"'></li>");
				$(".carousel-inner").append("<div class='item'><div class='container'><div class='carousel-caption'><div class='row'></div></div></div></div>");
				if (z == 0) z++;
			}
			
			if (y[i].getElementsByTagName('Category')[0].childNodes[0].nodeValue == cvalue || y[i].getElementsByTagName('Dif')[0].childNodes[0].nodeValue == lvalue) {
				
				$(".carousel-caption .row:last").append(
						"<div class='col-md-3'><img src='svgs/thumbnails/"
						+ y[i].getAttribute('Filename')
						+ "' alt=''><p>" 
						+ y[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue 
						+ "/ " 
						+ y[i].getElementsByTagName('Category')[0].childNodes[0].nodeValue 
						+ "/ " 
						+ y[i].getElementsByTagName('Dif')[0].childNodes[0].nodeValue
						+ "</p></div>");
				z++;
			}
		}
	}
	
	if ($(".carousel-indicators").length){
		$(".carousel-indicators li:first").addClass("active");
		$(".carousel-inner .item:first").addClass("active");
	}

}

function showExtraColors() {
	var strValidColors = "";
	for (var i = 0; i < validColors.length; i++)
		strValidColors += "<span style=color:" + validColors[i] + ">"
		+ validColors[i] + "</span>" + " ";
	$("#spanColors").append(strValidColors);
}

function autocompleteCommands() {
	//autocomplete function for command
	$("#cmdLine")
	// don't navigate away from the field on tab when selecting an item
	.bind(
			"keydown",
			function(event) {
				if (event.keyCode === $.ui.keyCode.TAB
						&& $(this).autocomplete("instance").menu.active) {
					event.preventDefault();
				}
			}).autocomplete({
				minLength : 0,
				source : availableCmds,
				focus : function() {
					// prevent value inserted on focus
					return false;
				},
				select : function(event, ui) {
					var terms = split(this.value);
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push(ui.item.value);
					// add placeholder to get the comma-and-space at the end
					terms.push("");
					this.value = terms.join("(");
					return false;
				}
			});
}

function bindDropdownClickFunction() {
	$(".catdd").on('click', 'li a', function() {
		$("#category_dropdown").text($(this).text());
		$("#category_dropdown").val($(this).text());
		
		if (filename = "game.html"){
			readXMLandShowPatternCatalog($("#category_dropdown").val(),$("#dif_dropdown").val());
		}
	});

	$(".difdd").on('click', 'li a', function() {
		$("#dif_dropdown").text($(this).text());
		$("#dif_dropdown").val($(this).text());
		
		if (filename = "game.html"){
			readXMLandShowPatternCatalog($("#category_dropdown").val(),$("#dif_dropdown").val());
		}
	});
}

