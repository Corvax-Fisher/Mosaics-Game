<?php
// recieved VARIABLES
$name = $_POST ['name'];
$width = $_POST ['width'];
$length = $_POST ['length'];
$category = $_POST['category'];
$dif = $_POST['dif'];
$svg = $_POST ['svg_xml'];

$count = 0;


// SIMPLEXML

$xml = simplexml_load_file ( "../xml/SVG_index.xml" );

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
	$dom->save ( '../xml/SVG_index.xml' );
	echo ("saved");
	
	// SAVE SVG FILE
	$svg_sxe = simplexml_load_string ( $svg );
	
	// Format SVG and save
	$svgdom = new DOMDocument ( '1.0' );
	$svgdom->preserveWhiteSpace = false;
	$svgdom->formatOutput = true;
	$svgdom->loadXML ( $svg_sxe->asXML () );
	$svgdom->save ( '../SVGs/' . $name . '.svg' );
	
	
	
	
// 	//Load SVG for Thumbnail
// 	$svg_sxe2 = simplexml_load_string ( $svg );
// 	//Edit Svg for Thumbnail
// 	$attWidth = 'width';
// 	$attHeight= 'height';
// 	$widthpx = $svg_sxe2->attributes()->$attWidth;
// 	$heightpx = $svg_sxe2->attributes()->$attHeight;
// 	$svg_sxe2->attributes()->$attWidth = $widthpx / 4;
// 	$svg_sxe2->attributes()->$attHeight = $heightpx / 4;
	
// 	// Create Thumbnail
// 	$svgdom2 = new DOMDocument ( '1.0' );
// 	$svgdom2->preserveWhiteSpace = false;
// 	$svgdom2->formatOutput = true;
// 	$svgdom2->loadXML ( $svg_sxe2->asXML () );
	
	
	
//	$svgdom2->save ( '../SVGs/' . $name . 'thumb' . '.svg' );
	
	
	
	
}

?>