<?php
    extract($_REQUEST);
    //include("/blumenbach/wisski/sites/all/modules/wisski/js/header.php");
    $user = "arnabbhattacharj";
	$password = "12345678";
	$hostname = "localhost";
	//$user = "sanjeev";
	//$password = "$olr4you";
	$dbname = "SemBlumenbachDB1";
	$dbname1 = "SemBlumenbachDB2";
	$host_tomcat = "localhost";
	$port = 8080;   
    // Connect the database.
    mysql_connect($hostname, $user, $password)
    or die("Unable to connect to SQL server");
    mysql_select_db($dbname1) or die('Unable to select the database!'.$user.' please check connection');

	$query = sprintf("SELECT GND from GND_CERL where CERL = '%s'", mysql_escape_string($ID));

    $result = mysql_query($query) or die(mysql_error());
    $gnd = array();
    
    while ($row = mysql_fetch_assoc($result)) {
        echo json_encode((int)$row["GND"]);
    }
    
    //echo json_encode(gnd);

