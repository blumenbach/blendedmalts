<?php
    extract($_REQUEST);
    $user = "texthighlight";
    $password = "texthighlightPWD122sdf";
    $hostname = "localhost";
    $dbname = "SemBlumenbachDB1";
    $dbname1 = "SemBlumenbachDB2";

    // Connect the database.
    mysql_connect($hostname, $user, $password)
    or die("Unable to connect to SQL server");
    mysql_select_db($dbname1) or die('Unable to select the database!'.$user.' please check connection');

	$query = sprintf("SELECT GND from GND_CERL where CERL = '%s'", mysql_escape_string($ID));

    $result = mysql_query($query) or die(mysql_error());
    $gnd = array();
    while ($row = mysql_fetch_assoc($result)) {
        if (isset($row)) {
        	echo json_encode((int)$row["GND"]);
	} 
    }
    
    //echo json_encode(gnd);

