<?php
$name = $_POST ['name'];
$newDif = $_POST['newDif'];

$xml = simplexml_load_file ( "../xml/svg_index.xml" );

//Find SVG with name
$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');

//Change Difficulty
$svg[0]->Dif = $newDif;

// Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

echo "changing Dif! please wait...";

?>