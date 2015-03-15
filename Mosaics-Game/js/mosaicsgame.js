/**
 * main mosaics game library
 */

//globals
var cellsize = 40;
var bounds = [ 8, 8 ];

var validColors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime",
               "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal",
               "yellow" ];

var availableCmds = ["circle","circles",
                     "line","lines",
                     "rectangle",
                     "square","squares",
                     "triangle","triangles",
                     "clearcell", "clearcells"];

var colorToRGB = {	"aqua" 		: "rgb(0, 255, 255)", 
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

var undoHistory = [],
redoHistory = [],
elementHistory = {};

var url = window.location.pathname,
filename = url.substring(url.lastIndexOf('/')+1);

var $svg;

$(function() {
	bindDropdownClickFunction();
	
	// show the colors available in the div
	showExtraColors();
	
	// read syntax.xml and show in syntax catalog
	loadSyntaxCatalogueFromXML();
	
	//autocomplete the commands for user friendly blub
	autocompleteCommands();
	
	$colorList = $(".coldd");
	$.each(validColors, function(i,color) {
		$colorList.append("<li><a>" + color + "</a></li>");
	});
	
	$(".mosaicsElement").attr("disabled", true);

	if (filename == "index.html" || filename == "") {
		
		$("input[type='radio']").attr("disabled", false);
		$("input[type='radio']").prop("checked", false);

		$(".jumbotron:first").css("border", "thick solid black");
		$("input[type='radio']").change(function(){
			if(this.checked) setGridSize(this.value);
		});

	} else if (filename == "game.html") {
		
		$.post("xml/SVG_index.xml", function(data) {
			$svg = $(data).find("SVG");
			showPatternCatalogue("All categories","All levels");
		});
		
		$("#okBtn").click(function() {
			$("#mosaics-user").attr("id","mosaics");
			gridSizeOk();
			$(".jumbotron.row:first").fadeOut();
		});

	}
});

function setGridSize(size) {

	$("#okBtn").attr("disabled", false);

	bounds = size.split("x");
	bounds[0] = Number(bounds[0]);
	bounds[1] = Number(bounds[1]);

	// Check count of Rows for cellsize
	if (bounds[0] > 12 || bounds[1] > 12)
		cellsize = 20;
	else
		cellsize = 40;

	// Set SVG-Canvas attributes
	var $svg = $("#mosaics");
	$svg.attr("width", cellsize * (bounds[0] + 1) + 2);
	$svg.attr("height", cellsize * (bounds[1] + 1) + 2);
	$svg.attr("viewBox", "0 0 " + (cellsize * (bounds[0] + 1) + 2) + " " + (cellsize * (bounds[1] + 1) + 2));

	// Set pattern attributes
	var $pattern = $("#mosaics-grid-pattern");
	$pattern.attr("width", cellsize);
	$pattern.attr("height", cellsize);
	$("#vline").attr("y2", cellsize);
	$("#hline").attr("x2", cellsize);

	// Set bounding rect attributes
	var $rect = $svg.find("rect:first");
	$rect.attr("x", cellsize);
	$rect.attr("y", cellsize);
	$rect.attr("width", cellsize * bounds[0] + 2);
	$rect.attr("height", cellsize * bounds[1] + 2);

}

function gridSizeOk() {
	// Disable radio buttons
	$("input[type='radio']").attr("disabled", true);

	// Change Grid Color
	$("#hline").css("stroke", "black");
	$("#vline").css("stroke", "black");

	$(".mosaicsElement").attr("disabled", false);
	$("#okBtn").attr("disabled", true);

	var jumbotronArray = document.getElementsByClassName("jumbotron");
	jumbotronArray[0].style.border = "";
	for (var i = 1; i < jumbotronArray.length; i++) {
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
//	$('html, body').animate({
//		scrollTop : ($('#editorCmd').offset().top)
//	}, 'slow');
}

function executeCommand(cmdLine) {
	var cmdAndParams = cmdLine.split("(");
	var cmdName = cmdAndParams[0], cmdParams = cmdAndParams[1];
	
	cmdParams = cmdParams.replace(")","");
	cmdParams = cmdParams.split(",");
	
	if($("#color_dropdown").val() != "(None)")
		cmdParams.push($("#color_dropdown").val());
	
	switch (cmdName) {
	case "clearcell":
		deleteElement( new position(cmdParams[0] +"," + cmdParams[1]) );
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
				+ cmdParams[2]) );
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

function parseCommand(cmdLine) {
	var cmdAndParams = cmdLine.split("(");
	if (cmdAndParams.length == 2) {
		var cmd= cmdAndParams[0], params = cmdAndParams[1];
		
		if(cmd.charAt(cmd.length-1) == "s" && params.indexOf("...") == -1) {
			$("#err").html("Range operator (...) is missing.");
			return 0;
		}
		
		if (params.indexOf(")") == -1) {
			$("#err").html("Closing bracket is missing.");
			return 0;
		}

	} else {
		$("#err").html("Opening bracket is missing.");
		return 0;
	}
	
	return 1;
}

function showWinMessage() {
	$("#win-message")
		.find("p")
		.empty()
		.append("Congratulations, You won!<br>" +
			"You finished the mosaic with " + undoHistory.length + " command(s).");
	
	$.colorbox( { 	inline: true, 
		href: "#win-message",
		width: "400px", 
		close:'<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' 
	} );
	
	$("#colorbox").keydown(function(event){
		if(event.key == "Enter") $.colorbox.close();
	});
}

function draw(cmdLine) {
	$("#err").html("");

	if(parseCommand(cmdLine) && validateParameters(cmdLine)) {
		executeCommand(cmdLine);
		manageHistory(cmdLine);
		if(compareSVGs()) showWinMessage();
	}

	if ($("#err").html().length > 0) {
		$("#messages").css("display", "block");
	} else {
		$("#messages").css("display", "none");
	}

	$('#history').scrollTop($('#history')[0].scrollHeight);

	return false;
}

//split value for autocomplete
function split(val) {
	return val.split(/,\s*/);
}

//SAVE
function save() {
	var err = false;

	if (undoHistory.length == 0) {
		$("#save_err").html("Please draw something first");
		err = true;
	} else if ($("#inputFileNameToSaveAs").val() == "") {
		$("#save_err").html("Please choose name");
		err = true;
	} else if ($("#category_dropdown").val() == "") {
		$("#save_err").html("Please choose category");
		err = true;
	} else if ($("#dif_dropdown").val() == "") {
		$("#save_err").html("Please choose difficulty");
		err = true;
	}

	if (err == true) {
		$("#save_messages").css("display", "block");
		window.scrollTo(0, document.body.scrollHeight);
		return false;
	}

	var svg = $("#mosaics").get(0);

	// Extract the data as SVG text string
	var svg_xml = new XMLSerializer().serializeToString(svg);

	
	// Jquery AJAX
	$.ajax({

		type : 'POST',
		url : 'php/Edit_SVG_index.php',
		data : {
			'name' : $("#inputFileNameToSaveAs").val(),
			'category' : $("#category_dropdown").val(),
			'dif' : $("#dif_dropdown").val(),
			'width' : bounds[0],
			'length' : bounds[1],
			'svg_xml' : svg_xml
		},

		success : function(response) {
			$("#save_messages").css("display", "block");
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

function loadSyntaxCatalogueFromXML() {
	
	$.post("xml/syntax.xml", function(data) {
		$syntax = $(data).find("syntax");
		for (var i=0;i<$syntax.length;i++) {
			$("#accordion").append(
					"<div class='panel panel-default'>" +
						"<div class='panel-heading' role='tab' id='heading"	+ i	+ "'>" + 
							"<h4 class='panel-title'>" +
								"<a data-toggle='collapse' data-parent='#accordion' href='#collapse"
									+ i	+ "' aria-expanded='false' aria-controls='collapse"	+ i	+ "'>"
									+ $syntax.find('command').eq(i).text() + 
								"</a>" + 
							"</h4>" +
						"</div>" +
						"<div id='collapse"	+ i	+ "' class='panel-collapse collapse' role='tabpanel'" +
							"aria-labelledby='heading" + i	+ "'>" + 
							"<div class='panel-body'>" + $syntax.find('description').eq(i).text() + "</div>" +
						"</div>" + 
					"</div>");
		}
	});
	
}

function showPatternCatalogue(cvalue,lvalue) {
	
	$(".carousel-indicators").empty();
	$(".carousel-inner").empty();
	
	var z = 0, ccvalue, llvalue;
	
	for (var i = 0; i < $svg.length; i++) {
		ccvalue = $svg.find('Category').eq(i).text() == cvalue;
		llvalue = $svg.find('Dif').eq(i).text() == lvalue;
		
		if (	(ccvalue && llvalue) || 
				(ccvalue && lvalue == "All levels") || 
				(llvalue && cvalue == "All categories") || 
				(cvalue == "All categories" && lvalue == "All levels")) {
			if (z%4 == 0) {
				$(".carousel-indicators").append("<li data-target='#myCarousel' data-slide-to='"+(z+1)+"'></li>");
				$(".carousel-inner").append("<div class='item'>"+
												"<div class='container'>"+
													"<div class='carousel-caption'>"+
														"<div class='row'></div>"+
													"</div>"+
												"</div>"+
											"</div>");
			}
			appendPattern($svg.eq(i));
			z++;		
		} 
	}
	
	if($(".carousel-inner").children().length == 0)
		$(".carousel-inner").append("<div class='item'>"+
										"<div class='container'>"+
											"<div class='carousel-caption'>"+
												"<div class='row'></div>"+
											"</div>"+
										"</div>"+
									"</div>");
	
	if ($(".carousel-indicators").length){
		$(".carousel-indicators li:first").addClass("active");
		$(".carousel-inner .item:first").addClass("active");
	}
	
	$( ".carousel-caption .row .col-md-3" ).click(function() {
		var svgpath = $(this).find("img").attr("src");
		loadSVGs(svgpath);
	});

}

function appendPattern($svg_indexElement) {
	$(".carousel-caption .row:last").append(
			"<div class='col-md-3'>" +
					"<img src='svgs/" + $svg_indexElement.attr('Filename') + "' alt=''>" + 
					"<div class='caption'>" +
						"<p>" 	+ $svg_indexElement.find('Name').text() + "<br>" 
								+ $svg_indexElement.find('Category').text() + "<br>" 
								+ $svg_indexElement.find('Dif').text() + 
						"</p>" +
					"</div>" +
			"</div>");
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
		$("#category_dropdown").html($(this).text() + ' <span class="caret"></span>');
		$("#category_dropdown").val($(this).text());
		
		if (filename = "game.html"){
			showPatternCatalogue($("#category_dropdown").val(),$("#dif_dropdown").val());
		}
	});

	$(".difdd").on('click', 'li a', function() {
		$("#dif_dropdown").html($(this).text() + ' <span class="caret"></span>');
		$("#dif_dropdown").val($(this).text());
		
		if (filename = "game.html"){
			showPatternCatalogue($("#category_dropdown").val(),$("#dif_dropdown").val());
		}
	});
	
	$(".coldd").on('click', 'li a', function() {
		$("#color_dropdown").html($(this).text() + ' <span class="caret"></span>');
		$("#color_dropdown").val($(this).text());
	});
}

function loadSVGs(svgPath) {
	
	$("#template-mosaics").load(svgPath, function(responseTxt, statusTxt, xhr) {
		var $templateRect = $("#mosaics rect");
		
		$("#mosaics").attr("id", "mosaics-template");
		var mosaicsTemplateElements = $("#mosaics-template > *[id^='e']");
		for(var i = 0; i < mosaicsTemplateElements.length; i++) {
			mosaicsTemplateElements.eq(i).attr("id", "t" + mosaicsTemplateElements.eq(i).attr("id"));
		}
		
		$("#mosaics-user").attr("id", "mosaics");
		var colCount, rowCount;
		colCount = (Number($templateRect.attr("width"))-2)/$templateRect.attr("x");
		rowCount = (Number($templateRect.attr("height"))-2)/$templateRect.attr("y");
		setGridSize(colCount + "x" + rowCount);
		$("#mosaics").attr("id", "mosaics-user");
	});
	
}
