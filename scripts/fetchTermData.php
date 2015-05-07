<?php
    extract($_REQUEST);
    //include("/blumenbach/wisski/sites/all/modules/wisski/js/header.php");

    $user = "texthighlight";
    $password = "texthighlightPWD122sdf";
    $hostname = "localhost";
    $dbname = "SemBlumenbachDB1";
    $dbname1 = "SemBlumenbachDB2";
    // Connect the database.
    mysql_connect($hostname, $user, $password)
    or die("Unable to connect to SQL server");
    mysql_select_db($dbname1) or die('Unable to select the database!'.$user.' please check connection');
	
    mysql_set_charset('utf8');
    $query = sprintf("SELECT name, description, link  FROM terms_description where terms = '%s' and status = 1 LIMIT 1", mysql_escape_string($term));
	$result = mysql_query($query) or die(mysql_error());
    
		while ($row = mysql_fetch_assoc($result)) {
			header('Content-Type: application/json');
			//echo json_encode(array('name' => $row["name"],'description'=> $row["description"],'link'=> $row["link"]));
			echo json_encode($row);
		}
	

