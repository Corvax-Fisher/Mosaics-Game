
<?php
if($_POST['passwort']=='thm654321') {
echo'
<script type="text/javascript">
	var svg = null;
	var anz;
	var setLoad;
	var category;
	var dif;
	var lastSelected;

	function clear() {
		svg = null;
		$("#permit").empty();
		$("#dif").empty();
		$("#category").empty();
		$("#size").empty();
		$("#prompt").empty();
		$("#liste").empty();
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
					$("#liste").append("<option>" + name + "</option>");
						if (name == lastSelected){
						$("#liste option:contains("+lastSelected+")").attr("selected", "selected");
						}
					}
				});
			$("#prompt").text(anz + " unpermitted SVGs");
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
				$("#liste").append("<option>" + name + "</option>");
				if (name == lastSelected){
				$("#liste option:contains("+lastSelected+")").attr("selected", "selected");
				}
			});
			$("#prompt").text(anz + " SVGs in total");
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
					$("#prompt").text(response);
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
			$("#prompt").text("Choose SVG before deleting!");
		}
	}

	//SVG has been clicked
	function change() {

		svg = $("#liste :selected").val();
		lastSelected=svg;
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
					$("#prompt").text(response);
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
			$("#prompt").text("Choose SVG before changing permission!");
		}
	}

	function rename() {
	
		if (svg != null) {
			var newName = prompt("Enter new Name:");
			if (newName) {
				if (!regexp(newName)) {
					$("#prompt").text("String not valid");
				} else {
					$.ajax({
						type : "POST",
						url : "php/change_name.php",
						data : {
							"name" : svg,
							"newName" : newName
							},
					success : function(response) {
						$("#prompt").text(response);
						if (response != "Name is already taken!") {
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
				$("#prompt").text("No name entered!");
			}
		} else {
			$("#prompt").text("Choose SVG before renaming!");
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
				$("#prompt").text(response);
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
		$("#prompt").text("Choose SVG before changing Category or same Category");
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
					$("#prompt").text(response);
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
			$("#prompt").text("Choose SVG before changing Dif or same Dif");
		}
	}	
	
</script>



	<button type="button" onclick="load()">Load unpermitted</button>
	<button type="button" onclick="loadAll()">Load All</button>
	<p>
		<select id="liste" name="unpermitted svgs" size="8"
			onclick="change()" onchange="change()">
			</select>
	</p>
	<label id="prompt" style="color: red; font-size: 14pt"></label>
	<div>
		<button type="button" onclick="del()">Delete</button>
		<button id="rename" type="button" onclick="rename()">Rename</button>
	</div>
	<br>
	<label id="category" style="color: blue; font-size: 14pt"></label>
	<br>
	<button id="change_category" type="button" onclick="change_category()">Change Category</button>	
		<select id="new_category" name="category" size="1">
			<option>Flowers and Nature</option>
			<option>Countries and Flags</option>
			<option>Humans and Animals</option>
			<option>Things</option>
			<option>Symmetrical Patterns</option>
			<option>Individual Patterns</option>
		</select>
	
	<br>
	
	<label id="dif" style="color: blue; font-size: 14pt"></label>
	<br>
	<button id="change_dif" type="button" onclick="change_dif()">Change Dif</button>	
		<select id="new_dif" name="category" size="1">
			<option>Hard</option>
			<option>Normal</option>
			<option>Easy</option>
		</select>
	
	<br>
	<label id="permit" style="color: blue; font-size: 14pt"></label>
	<br>
	<button id="permitBtn" type="button" onclick="permit()" >Change
			Permission</button>
	<br>
	<br>
	<label id="size" style="color: blue; font-size: 12pt"></label>
	<br>
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
<label id="dif" style="color: red; font-size: 14pt">Wrong Password!</label>
';
}
?>


