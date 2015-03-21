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
	
	if(!file_put_contents('../svgs/' . $name . '.svg', $svg))
		echo "error saving $name";
	else echo "saved";
	
}

?>