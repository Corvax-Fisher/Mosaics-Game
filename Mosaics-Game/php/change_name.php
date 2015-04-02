<?php
$name = $_POST ['name'];
$newName = $_POST ['newName'];

$newName_low = mb_strtolower($newName);

$xml = simplexml_load_file ( "../xml/svg_index.xml" );
$att='Filename';

// Check if Name already taken
foreach ( $xml->SVG as $child ) {
	$str = mb_strtolower(( string ) $child->Name);

	if ($str == $newName_low) {
		echo ("Name already taken!");
		return;
	}
}

//Change XML
$svg = $xml->xpath('/SVGFiles/SVG[Name="'.$name .'"]');
$svg[0]->Name = $newName;
$svg[0]->attributes()->$att = "$newName.svg";

//Save XML changes
//Format XML and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/svg_index.xml' );

//Rename File
rename('../svgs/' . $name . '.svg','../svgs/' . $newName . '.svg');
echo ($name .' renamed to ' . $newName);
?>