<?php 
	$fileNm = $_REQUEST["f"];
	
	if(!empty($fileNm)){
		$layout = new DOMDocument();
		$layout->load("../svg/".$fileNm);
		
		$xpath = new DOMXpath($layout);
		$xpath->registerNamespace("s", "http://www.w3.org/2000/svg");
		$rooms = $xpath->query("//s:*[@class='room']");
		$floors = $xpath->query("//s:*[@class='floor']");
		
		function getAttr($nd, $nm){
			return $nd->attributes->getNamedItem($nm)->nodeValue;
		}
		
		echo("{\"rooms\":[");
		foreach($rooms as $r){
			$nm = $r->nodeName;
			$nr = getAttr($r, 'roomNr');
			$fnr = getAttr($r, 'floorNr');
			
			echo("{\"type\":\"".$nm."\", \"nr\":".$nr.",");
			echo("\"fnr\":".$fnr.",");
			if($nm=='rect'){
				echo("\"x\":".getAttr($r, 'x').",");
				echo("\"y\":".getAttr($r, 'y').",");
				echo("\"h\":".getAttr($r, 'height').",");
				echo("\"w\":".getAttr($r, 'width').",");
			}
			elseif($nm=='path'){
				echo("\"d\":\"".getAttr($r, 'd')."\",");
			}
			echo("\"tr\":\"".getAttr($r, 'transform')."\"");
			echo("},");
		}
		echo("null], \"floors\":[");
		foreach($floors as $fl){
			$nm = $fl->nodeName;
			$nr = getAttr($fl, 'floorNr');
			
			echo("{\"type\":\"".$nm."\", \"nr\":".$nr.",");
			if($nm=='rect'){
				echo("\"x\":".getAttr($fl, 'x').",");
				echo("\"y\":".getAttr($fl, 'y').",");
				echo("\"h\":".getAttr($fl, 'height').",");
				echo("\"w\":".getAttr($fl, 'width').",");
			}
			elseif($nm=='path'){
				echo("\"d\":\"".getAttr($fl, 'd')."\",");
			}
			echo("\"tr\":\"".getAttr($fl, 'transform')."\"");
			echo("},");
		}
		
		echo("null]}");
	}

?>
