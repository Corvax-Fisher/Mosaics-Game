<?php
// GESENDETE VARIABLEN
$name = $_POST ['name'];
$breite = $_POST ['breite'];
$hoehe = $_POST ['hoehe'];
$kategorie = $_POST['kategorie'];
$SVG = $_POST ['svg_xml'];

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
	
	// Format XML and save
	$dom = new DOMDocument ( '1.0' );
	$dom->preserveWhiteSpace = false;
	$dom->formatOutput = true;
	$dom->loadXML ( $xml->asXML () );
	$dom->save ( '../SVG_index.xml' );
	echo ("gespeichert");
	
	// SAVE SVG FILE
	$SVG_sxe = simplexml_load_string ( $SVG );
	
	// Format XML and save indented tree rather than one line
	$SVGdom = new DOMDocument ( '1.0' );
	$SVGdom->preserveWhiteSpace = false;
	$SVGdom->formatOutput = true;
	$SVGdom->loadXML ( $SVG_sxe->asXML () );
	$SVGdom->save ( '../SVGs/' . $name . '.svg' );
	
	// $SVG_sxe->asXml('../SVGs/' .$name .'.svg');
}

?>