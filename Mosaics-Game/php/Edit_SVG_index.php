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
	$svg_sxe_thumb = simplexml_load_string ( $svg );
	//Edit Svg for Thumbnail
	$attWidth = 'width';
	$attHeight= 'height';
	$widthpx = $svg_sxe_thumb->attributes()->$attWidth;
	$heightpx = $svg_sxe_thumb->attributes()->$attHeight;
	$svg_sxe_thumb->attributes()->$attWidth = $widthpx / 4;
	$svg_sxe_thumb->attributes()->$attHeight = $heightpx / 4;
	
	// Create Thumbnail
	$svgdomthumb = new DOMDocument ( '1.0' );
	$svgdomthumb->preserveWhiteSpace = false;
	$svgdomthumb->formatOutput = true;
	$svgdomthumb->loadXML ( $svg_sxe_thumb->asXML () );
	
	
	
	$svgdomthumb->save ( '../SVGs/thumbnails/' . $name . '.svg' );
	
	
	
	
}

?>