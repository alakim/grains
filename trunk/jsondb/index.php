<!DOCTYPE html>
<html>
<head>
	<meta encoding="utf-8"/>
	<title>JSONDB Demo Page</title>
	<link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
	<h1>JSONDB Demo Page</h1>
	<?php
	include 'jsondb.php';
	
	$db = new JSONDB("data");
	?>
	
	<?php
	$path = "persons/iii/name";
	$val = $db->getValue($path);
	?>
	<p><?=$path?>: '<?=$val?>'</p>
	
	<?php
	$path = "persons/iii/phone";
	$val = $db->getValue($path);
	?>
	<p><?=$path?>: '<?=$val?>'</p>
	
	<?php
	$path = "persons/iii";
	$val = $db->getValue($path);
	?>
	<p><?=$path?>: name:'<?=$val->name?>', phone:'<?=$val->phone?>'</p>
	
	<?php
	$path = "persons";
	$val = $db->getValue($path);
	?>
	<p><?=$path?>: iii.name:'<?=$val->iii->name?>'</p>
</body>
</html>
