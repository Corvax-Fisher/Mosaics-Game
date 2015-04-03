<?php
$name = $_POST ['name'];

$xml = simplexml_load_file ( "../xml/svg_index.xml" );

//Find SVG with name

$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');


 	unset($svg[0][0]);



// Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

// Delete SVG
unlink('../svgs/' . $name . '.svg');


echo "deleted! please wait....";


?>