
<?php
if($_POST['passwort']=='thm654321') {
echo'
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
	
	//Load unpermitted SVGs
	function load() {
		setLoad = "load";
		anz = 0;
		clear();
		
		$.get("xml/svg_index.xml", {}, function(xml) {

			$("SVG", xml).each(function(i) {

				var permitted = $(this).find("Permitted").text();
				var name = $(this).find("Name").text();

				if (permitted == "false") {
					anz++;
					$("#header select").append("<option>" + name + "</option>");
					}
				});
			$("#ausgabe").text(anz + " unpermitted");
		});
	}

	//load all SVGs
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

	//SVG has been clicked
	function change() {

		svg = $("#liste :selected").val();
		$("#svgfile").load("svgs/" + svg + ".svg");

		$.get("xml/svg_index.xml", {}, function(xml) {
			$("SVG", xml).each(function(i) {
				var name = $(this).find("Name").text();
				if (name == svg) {
					$("#dif").text("Difficulty: " + $(this).find("Dif").text());
					dif =  $(this).find("Dif").text();
					$("#category").text("Category: " + $(this).find("Category").text());
					category = $(this).find("Category").text();
					$("#size").text("Size: " + $(this).find("Width").text() + " x "	+ $(this).find("Length").text());
					$("#permit").text("Permitted: " + $(this).find("Permitted").text());
					return;
				}
			});
		});
	}
	
	//Change the Permission
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
			$("#ausgabe").text("Choose SVG before change Permission!");
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
		$("#ausgabe").text("Choose SVG before change Category or same category");
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
			$("#ausgabe").text("Choose SVG before change Dif or same Dif");
		}
	}	
	
</script>



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
		<button id="permitBtn" type="button" onclick="permit()" >Change
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

';

}
else {
echo'
<script type="text/javascript">	
$(function() {
    $("#passwort").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            login();
            return false;
        } else {
            return true;
        }
    });
});
</script>


<input id="passwort" type="password"/>
<button type="button" onclick="login()">Login</button>
<br>	
<label id="dif" style="color: red; font-size: 14pt">falsches Passwort!</label>
';
}
?>


