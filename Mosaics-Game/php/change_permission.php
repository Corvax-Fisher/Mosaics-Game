<?php
$name = $_POST ['name'];

$xml = simplexml_load_file ( "../xml/svg_index.xml" );

//Find SVG with name
$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');

//Change Permission to opposite
if ($svg[0]->Permitted =="false"){
	$svg[0]->Permitted ="true";
	$permStr = "permitted! please wait...";
} else {
	$svg[0]->Permitted ="false";
	$permStr = "unpermitted! please wait...";
}

// Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

echo $permStr;

?>