
<?php
if($_POST['passwort']=='thm654321') {
echo'
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Permission Check</title>

<script	src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
	

<script type="text/javascript">



var svg=null;
var anz;

function clear(){
	svg=null;
	$("#permit").empty();
	$("#dif").empty();
	$("#category").empty();
	$("#size").empty();
	$("#ausgabe").empty();
	$("#header select").empty();
	$("#svgfile").empty();	
}
		
function load(){
	anz = 0;
	clear();
	$.get("xml/svg_index.xml",{},function(xml){

		  $("SVG",xml).each(function(i) {
			  var permitted = $(this).find("Permitted").text();
			  var name =  $(this).find("Name").text();
			  
			  if (permitted=="false"){
				  	anz++;
					  $("#header select").append("<option>" + name + "</option>");}
			  
			  });
		  
			$("#ausgabe").text(anz + " unpermitted");
			
			if (anz >= 1) {	
				$("#permitBtn").attr("disabled", false);
			} else {
				$("#permitBtn").attr("disabled", true);
			}
	
	});
	
	 
}

function loadAll(){
	anz = 0;
	clear();
	$.get("xml/svg_index.xml",{},function(xml){

		  $("SVG",xml).each(function(i) {
			  anz++;
			  var name =  $(this).find("Name").text();
			  $("#header select").append("<option>" + name + "</option>");
			  
			  });
		  
			$("#ausgabe").text(anz + " SVGs");
			if (anz >= 1) {	
				$("#permitBtn").attr("disabled", false);
			} else {
				$("#permitBtn").attr("disabled", true);
			}
		  });
	 
}

function del(){
	var name = svg;
	if (name != null){
	$.ajax({

		type : "POST",
		url : "php/delete.php",
		data : {
			"name" : name,
		},

		success : function(response) {
			$("#ausgabe").text(response);
			setTimeout(function(){
				load();
				}, 1000);				
		}
	});
	}else{
		$("#ausgabe").text("Choose SVG before delete!");
	}
}

 function change(){

	 svg = $("#liste :selected").val();
	 $("#svgfile").load("svgs/"+ svg + ".svg");
	 
	 $.get("xml/svg_index.xml",{},function(xml){
		 $("SVG",xml).each(function(i) {
			  var name =  $(this).find("Name").text();
			  if (name == svg) {
				$("#dif").text("Difficulty: " + $(this).find("Dif").text());
				$("#category").text("Category: " + $(this).find("Category").text());
				$("#size").text("Size: " + $(this).find("Width").text() + " x " + $(this).find("Length").text());
				$("#permit").text("Permitted: " + $(this).find("Permitted").text());
				return;			  
			  }
		 });
		 
	 });
} 





function permit(){
	
	var name = svg;
	if (name != null){
	$.ajax({

		type : "POST",
		url : "php/change_permission.php",
		data : {
			"name" : name,
		},

		success : function(response) {
			$("#ausgabe").text(response);
			setTimeout(function(){
				load();
				}, 1000);
				
		}
	});
	} else{
		$("#ausgabe").text("Choose SVG before permit!");
	}
	
}
	




</script>


</head>
<body>
<button type="button" onclick="load()">Load unpermitted</button>
<button type="button" onclick="loadAll()">Load All</button>
<div id="header">
	<p>
    <select id="liste" name="unpermitted svgs" size="8" onchange="change()">
     
  
    </select>
  </p>
</div>
<label id="ausgabe" style="color: red; font-size: 14pt"></label>
<div>
<button id="permitBtn" type="button" onclick="permit()" disabled >Change Permission</button>
<button type="button" onclick="del()">Delete</button>
</div>
<br>
<label id="category" style="color: black; font-size: 12pt"></label>
<br>
<label id="dif" style="color: black; font-size: 12pt"></label>
<br>
<label id="size" style="color: black; font-size: 12pt"></label>
<br>
<label id="permit" style="color: red; font-size: 12pt"></label>
<br>
<div id="svgfile" style="width:400px; height: 400px;">
</body>
</html>
';

}
else {
echo'
    <input id="passwort" type="password" name="passwort" />
    <button type="button" onclick="loging()">Login</button>
';
}
?>


