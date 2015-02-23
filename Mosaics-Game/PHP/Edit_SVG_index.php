<?php
// sended VARIABLES
$name = $_POST ['name'];
$width = $_POST ['width'];
$length = $_POST ['length'];
$category = $_POST['category'];
$dif = $_POST['dif'];
$svg = $_POST ['svg_xml'];

$count = 0;


// SIMPLEXML

$xml = simplexml_load_file ( "../SVG_index.xml" );

// Check if Name already taken
foreach ( $xml->SVG as $child ) {
	if (( string ) $child->Name == $name) {
		$count ++;
	}
}


// Name Already taken else create Child Node
if ($count > 0) {
	echo ("Name already taken!");
} else {
	$newChild = $xml->addChild ( "SVG" );
	$newChild->addAttribute ( "Filename", "$name.svg" );
	$newChild->addChild ( "Name", $name );
	$newChild->addChild ( "Category", $category );
	$newChild->addChild ( "Width", $width );
	$newChild->addChild ( "Length", $length );
	$newChild->addChild ( "Dif", $dif );
	
	// Format XML and save
	$dom = new DOMDocument ( '1.0' );
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;
	$dom->loadXML ( $xml->asXML () );
	$dom->save ( '../SVG_index.xml' );
	echo ("saved");
	
	// SAVE SVG FILE
	$svg_sxe = simplexml_load_string ( $svg );
	
	// Format XML and save indented tree rather than one line
	$svgdom = new DOMDocument ( '1.0' );
	$svgdom->preserveWhiteSpace = false;
	$svgdom->formatOutput = true;
	$svgdom->loadXML ( $svg_sxe->asXML () );
	$svgdom->save ( '../SVGs/' . $name . '.svg' );
	
	
}

?>