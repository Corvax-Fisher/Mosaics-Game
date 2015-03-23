<?php
$name = $_POST ['name'];


$xml = simplexml_load_file ( "../xml/SVG_index.xml" );

$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');

 if (! empty($svg)) {
 	unset($svg[0][0]);
}


// Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/SVG_index.xml' );

// Delete SVG
unlink('../svgs/' . $name . '.svg');


echo "deleted! please wait....";


?>