<html>
<head>
	<style type="text/css">
		body{
			font-family: Verdana, Arial, Sans-Serif;
			font-size:14px;
		}
		li{
			margin: 0 0 0 10px;
			padding:0;
		}
		a:link{text-decoration:none;}
		a:hover{text-decoration:underline;}
		a:visited{text-decoration:none;}
	</style>
</head>
<body>
	<div style="display:none;">
	<?php
	$dir = $_REQUEST["d"];
	$file = $_REQUEST["f"];
	?>
	</div>

<p><a href="/setmode.php">to Top</a></p>

<?php
	
	if($file!="")
		if(!chmod($file, 0777)){
			echo("FAILURE! file: '{$file}'");
		}
	if(!chmod($dir, 0777)){
		echo("FAILURE! dir: '{$dir}'");
	}

	if($dir=="") $dir = "."; //$dir = "/home/gsblock/www";
	$items = scandir($dir);
	if($items==false){
		// echo(E_WARNING);
		print_r(error_get_last());
	}
	echo("<ul>");
	foreach($items as $item){
		if($item!="." && $item!=".." && $item!=".svn"){
			if(is_dir($dir."/".$item))
				echo("<li><a href='?d={$dir}/{$item}'>{$item}/</a></li>");
			else{
				$perms =  sprintf('%o', fileperms($dir."/".$item));
				//$perms = substr($perms, 3);
				echo("<li><a href='?d={$dir}&f={$dir}/{$item}'>{$item}</a> ({$perms})</li>");
			}
		}
	}
	echo("</ul>");

?>

</body>
</html>