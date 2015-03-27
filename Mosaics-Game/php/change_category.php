<?php
$name = $_POST ['name'];
$newCategory = $_POST['newCategory'];



$xml = simplexml_load_file ( "../xml/svg_index.xml" );

$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');

$svg[0]->Category = $newCategory;
// Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

echo "changed Category";

?>