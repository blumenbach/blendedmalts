<?php
    extract($_REQUEST);
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
    mysql_select_db($dbname1) or die('Unable to select the database for '.$user.' please check connection');


	$query = mysql_query("SELECT terms FROM terms_description WHERE status = 1") or die(mysql_error());
    	
	$results = array();
	
	while ($row=mysql_fetch_array($query)) { 
		$results[] = array("term" => $row['terms']); 
	} 

	echo json_encode($results);
