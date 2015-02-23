<?php
// sended VARIABLES
$name = $_POST ['name'];
$breite = $_POST ['breite'];
$hoehe = $_POST ['hoehe'];
$kategorie = $_POST['kategorie'];
$schwiergkeitsgrad = $_POST['schwiergkeitsgrad'];
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
	echo ("Name vergeben!");
} else {
	$newChild = $xml->addChild ( "SVG" );
	$newChild->addAttribute ( "Dateiname", "$name.svg" );
	$newChild->addChild ( "Name", $name );
	$newChild->addChild ( "Kategorie", $kategorie );
	$newChild->addChild ( "Breite", $breite );
	$newChild->addChild ( "Hoehe", $hoehe );
	$newChild->addChild ( "schwiergkeitsgrad", $schwiergkeitsgrad );
	
	// Format XML and save
	$dom = new DOMDocument ( '1.0' );
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;
	$dom->loadXML ( $xml->asXML () );
	$dom->save ( '../SVG_index.xml' );
	echo ("gespeichert");
	
	// SAVE SVG FILE
	$svg_sxe = simplexml_load_string ( $svg );
	
	// Format XML and save indented tree rather than one line
	$svgdom = new DOMDocument ( '1.0' );
	$svgdom->preserveWhiteSpace = false;
	$svgdom->formatOutput = true;
	$svgdom->loadXML ( $svg_sxe->asXML () );
	$svgdom->save ( '../SVGs/' . $name . '.svg' );
	
	// $SVG_sxe->asXml('../SVGs/' .$name .'.svg');
}

?>