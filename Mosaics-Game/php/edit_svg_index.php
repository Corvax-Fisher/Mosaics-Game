<?php
// received VARIABLES
$name = $_POST ['name'];
$width = $_POST ['width'];
$length = $_POST ['length'];
$category = $_POST['category'];
$dif = $_POST['dif'];
$svg = $_POST ['svg_xml'];

//create SIMPLEXML Object
$xml = simplexml_load_file ( "../xml/svg_index.xml" );

// Check if Name already taken
$name_low = mb_strtolower($name);
foreach ( $xml->SVG as $child ) {
	$str = mb_strtolower(( string ) $child->Name);
	
	if ($str == $name_low) {
		echo ("Name already taken!");
		return;
	}
}

// Name not taken. Create Child Node
$newChild = $xml->addChild ( "SVG" );
$newChild->addAttribute ( "Filename", "$name.svg" );
$newChild->addChild ( "Name", $name );
$newChild->addChild ( "Category", $category );
$newChild->addChild ( "Width", $width );
$newChild->addChild ( "Length", $length );
$newChild->addChild ( "Dif", $dif );
$newChild->addChild ( "Permitted", "false" );
	
// Convert XML File to DOM Object for formatting and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

//Save SVG File	
if(!file_put_contents('../svgs/' . $name . '.svg', $svg))
	echo "error saving $name";
else echo "saved";
?>
