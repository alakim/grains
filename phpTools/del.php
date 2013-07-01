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
	<div style="display:block; border:1px solid #888;">
	<?php
	$dir = $_REQUEST["d"];
	if($dir=="")
		$dir = "./";
	else{
		$mt = preg_grep("/\/$/", array("sdfjslk"));
		if(count($mt)==0)
			$dir = $dir."/";
	}
	echo($dir);
	$file = $_REQUEST["f"];
	$delf = $_REQUEST["delf"];
	$deld = $_REQUEST["deld"];
	?>
	</div>

<p><a href="del.php">to Top</a></p>

<?php
	
	// if($file!="")
		// if(!chmod($file, 0777)){
			// echo("FAILURE! file: '{$file}'");
		// }
	// if(!chmod($dir, 0777)){
		// echo("FAILURE! dir: '{$dir}'");
	// }
	
	function deleteDir($d){
		$files = scandir($d);
		foreach($files as $f){
			if($f!="." && $f!=".."){
				if(is_dir($d.'/'.$f))
					deleteDir($d.'/'.$f);
				else
					unlink($d.'/'.$f);
			}
		}

		rmdir($d);
	}
	
	if($delf!="")
		unlink($delf);
	else if($deld!="")
		deleteDir($deld);

	$items = scandir($dir);
	if($items==false){
		// echo(E_WARNING);
		print_r(error_get_last());
	}
	echo("<ul>");
	foreach($items as $item){
		if($item!="." && $item!=".." && $item!=".svn" && $item!="del.php"){
			if(is_dir($dir."/".$item))
				echo("<li><a href='?d={$dir}{$item}'>{$item}/</a> [<a href='?d={$dir}&deld={$dir}{$item}'>delete</a>]</li>");
			else{
				//$perms =  sprintf('%o', fileperms($dir."/".$item));
				echo("<li>{$item} [<a href='?d={$dir}&delf={$dir}{$item}'>delete</a>]</li>");
			}
		}
	}
	echo("</ul>");

?>

</body>
</html>