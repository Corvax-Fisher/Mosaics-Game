<?php
// received VARIABLES
$filename = $_POST ['filename'];
$commands = $_POST ['commands'];
$username= $_POST ['username'];

//create SIMPLEXML Object
$xml = simplexml_load_file ( "../xml/scores.xml" );

$user_low = mb_strtolower($username);
$file_low =  mb_strtolower($filename);
foreach ( $xml->SVG as $child ) {
	$str = mb_strtolower(( string ) $child->username);
	$str2 = mb_strtolower(( string ) $child->filename);
	$str3 = $child->commands;
	
	if ($user_low == $username && $file_low == $filename) {
		if ($str3 > $commands){
			$str3 = $commands;
		}
		echo "saved";
		return;
	}
}

	// Name not taken. Create Child Node
$newChild = $xml->addChild ( "score" );
$newChild->addChild ( "username", $username );
$newChild->addChild ( "filename", $filename );
$newChild->addChild ( "commands", $commands );

// Convert XML File to DOM Object for formatting and save
$dom = new DOMDocument ( '1.0' );
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML ( $xml->asXML () );
$dom->save ( '../xml/scores.xml' );

echo "saved";
?>
