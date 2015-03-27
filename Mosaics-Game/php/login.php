
<?php
if($_POST['passwort']=='thm654321') {
echo'
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Permission Check</title>

<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>


<script type="text/javascript">
	var svg = null;
	var anz;
	var setLoad;
	var category;
	var dif;

	function clear() {
		svg = null;
		$("#permit").empty();
		$("#dif").empty();
		$("#category").empty();
		$("#size").empty();
		$("#ausgabe").empty();
		$("#header select").empty();
		$("#svgfile").empty();
	}

	function load() {
		setLoad = "load";
		anz = 0;
		clear();
		$.get("xml/svg_index.xml", {}, function(xml) {

			$("SVG", xml).each(
					function(i) {
						var permitted = $(this).find("Permitted").text();
						var name = $(this).find("Name").text();

						if (permitted == "false") {
							anz++;
							$("#header select").append(
									"<option>" + name + "</option>");
						}

					});

			$("#ausgabe").text(anz + " unpermitted");

			if (anz >= 1) {
				$("#permitBtn").attr("disabled", false);
			} else {
				$("#permitBtn").attr("disabled", true);
			}

		});

	}

	function loadAll() {
		setLoad = "loadAll";
		anz = 0;
		clear();
		$.get("xml/svg_index.xml", {}, function(xml) {

			$("SVG", xml).each(function(i) {
				anz++;
				var name = $(this).find("Name").text();
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

	function del() {
		
		if (svg != null) {
			$.ajax({

				type : "POST",
				url : "php/delete.php",
				data : {
					"name" : svg,
				},

				success : function(response) {
					$("#ausgabe").text(response);
					setTimeout(function() {
						if (setLoad == "load") {
							load();
						} else {
							loadAll();
						}
					}, 2000);
				}
			});
		} else {
			$("#ausgabe").text("Choose SVG before delete!");
		}
	}

	function change() {

		svg = $("#liste :selected").val();
		$("#svgfile").load("svgs/" + svg + ".svg");

		$.get("xml/svg_index.xml", {}, function(xml) {
			$("SVG", xml)
					.each(
							function(i) {
								var name = $(this).find("Name").text();
								if (name == svg) {
									$("#dif").text(
											"Difficulty: "
													+ $(this).find("Dif")
															.text());
									dif =  $(this).find("Dif")
									.text();
									$("#category").text(
											"Category: "
													+ $(this).find("Category")
															.text());
									category = $(this).find("Category")
									.text();
									$("#size").text(
											"Size: "
													+ $(this).find("Width")
															.text()
													+ " x "
													+ $(this).find("Length")
															.text());
									$("#permit").text(
											"Permitted: "
													+ $(this).find("Permitted")
															.text());
									return;
								}
							});

		});
	}

	function permit() {

		
		if (svg != null) {
			$.ajax({

				type : "POST",
				url : "php/change_permission.php",
				data : {
					"name" : svg,
				},

				success : function(response) {
					$("#ausgabe").text(response);
					setTimeout(function() {
						if (setLoad == "load") {
							load();
						} else {
							loadAll();
						}
					}, 2000);

				}
			});
		} else {
			$("#ausgabe").text("Choose SVG before permit!");
		}

	}

function rename() {
	
	if (svg != null) {
		var newName = prompt("Enter new Name:");
		if (newName) {
			if (!regexp(newName)) {
				$("#ausgabe").text("String not valid");
				} else {
					$.ajax({
						type : "POST",
						url : "php/change_name.php",
						data : {
							"name" : svg,
							"newName" : newName
							},
					success : function(response) {
						$("#ausgabe").text(response);
						if (response != "Name already taken!") {
							setTimeout(function() {
								if (setLoad == "load") {
									load();
								} else {
									loadAll();
								}
							}, 2000);
						}
					}
				});
			}
		} else {
			$("#ausgabe").text("No Name entered!");
		}
	} else {
		$("#ausgabe").text("Choose SVG before rename!");
	}

}

//Check for regexp
function regexp(str) {
	var patt = new RegExp("^[a-zA-Z0-9_\-]+$");
	var res = patt.test(str);
	return res;
}
	
	
//Change Category
function change_category(){
	var newCategory = $("#new_category").val();
	if (svg != null && category != newCategory) {
		$.ajax({

			type : "POST",
			url : "php/change_category.php",
			data : {
				"name" : svg,
				"newCategory" : newCategory
			},

			success : function(response) {
				$("#ausgabe").text(response);
				setTimeout(function() {
					if (setLoad == "load") {
						load();
					} else {
						loadAll();
					}
				}, 2000);

			}
		});
	} else {
		$("#ausgabe").text("Choose SVG before permit! or same category");
	}

}	

//Change Difficult
function change_dif(){
	var newDif = $("#new_dif").val();
	if (svg != null && dif != newDif) {
		$.ajax({

			type : "POST",
			url : "php/change_dif.php",
			data : {
				"name" : svg,
				"newDif" : newDif
			},

			success : function(response) {
				$("#ausgabe").text(response);
				setTimeout(function() {
					if (setLoad == "load") {
						load();
					} else {
						loadAll();
					}
				}, 2000);

			}
		});
	} else {
		$("#ausgabe").text("Choose SVG before permit! or same Dif");
	}

}	
	
</script>


</head>
<body>
	<button type="button" onclick="load()">Load unpermitted</button>
	<button type="button" onclick="loadAll()">Load All</button>
	<div id="header">
		<p>
			<select id="liste" name="unpermitted svgs" size="8"
				onchange="change()">


			</select>
		</p>
	</div>
	<label id="ausgabe" style="color: red; font-size: 14pt"></label>
	<div>
		<button id="permitBtn" type="button" onclick="permit()" disabled>Change
			Permission</button>
		<button type="button" onclick="del()">Delete</button>
		<button id="rename" type="button" onclick="rename()">Rename</button>
	</div>
	<br>
	<label id="category" style="color: red; font-size: 14pt"></label>
	
	<button id="change_category" type="button" onclick="change_category()">change Category</button>	
		<select id="new_category" name="category" size="1">
			<option>Flowers and Nature</option>
			<option>Countries and Flags</option>
			<option>Humans and Animals</option>
			<option>Things</option>
			<option>Symmetrical Patterns</option>
			<option>Individual Patterns</option>
		</select>
	
	<br>
	
	<label id="dif" style="color: red; font-size: 14pt"></label>
	<button id="change_dif" type="button" onclick="change_dif()">change Dif</button>	
		<select id="new_dif" name="category" size="1">
			<option>Hard</option>
			<option>Normal</option>
			<option>Easy</option>
		</select>
	
	<br>
	<label id="permit" style="color: red; font-size: 14pt"></label>
	<br>
	<label id="size" style="color: black; font-size: 12pt"></label>
	<br>
	<div id="svgfile" style="width: 400px; height: 400px;">
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


