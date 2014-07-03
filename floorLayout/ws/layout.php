<?php 
	$fileNm = $_REQUEST["f"];
	
	
	if(!empty($fileNm)){
		$layout = new DOMDocument();
		$layout->load("../svg/".$fileNm);
		
		$xpath = new DOMXpath($layout);
		$xpath->registerNamespace("s", "http://www.w3.org/2000/svg");
		
		function writeClass($xpath, $clNm, $section, $attrMap){
			$items = $xpath->query("//s:*[@class='".$clNm."']");
			echo("\"".$section."\":[");
			foreach($items as $r){
				$nm = $r->nodeName;
				$itmID = getAttr($r, "id");
				
				echo("{\"type\":\"".$nm."\",");
				echo("\"id\":\"{$itmID}\",");
				
				if($nm=='text'){
					$tNd = $xpath->query("text()", $r->childNodes->item(0));
					
					$txt = $tNd->item(0)->nodeValue;
					$txt = mb_convert_encoding($txt, "Windows-1251", "UTF-8");
					echo("\"txt\":\"{$txt}\",");
				}
				
				if(!empty($attrMap)){
					foreach($attrMap as $svg=>$json){
						$val = getAttr($r, $svg);
						echo("\"{$json}\":\"{$val}\",");
					}
				}
				
				if($nm=='rect'){
					echo("\"x\":".getAttr($r, 'x').",");
					echo("\"y\":".getAttr($r, 'y').",");
					echo("\"h\":".getAttr($r, 'height').",");
					echo("\"w\":".getAttr($r, 'width').",");
				}
				elseif($nm=='path'){
					echo("\"d\":\"".getAttr($r, 'd')."\",");
				}
				elseif($nm=='text'){
					echo("\"x\":".getAttr($r, 'x').",");
					echo("\"y\":".getAttr($r, 'y').",");
				}
				echo("\"tr\":\"".getAttr($r, 'transform')."\"");
				echo("},");
			}
			echo("null]");
		}
		
		function getAttr($nd, $nm){
			return $nd->attributes->getNamedItem($nm)->nodeValue;
		}
		
		echo("{");
		$numMap = Array("roomNr"=>"nr", "floorNr"=>"fnr");
		writeClass($xpath, 'room', 'rooms', $numMap);
		echo(",");
		writeClass($xpath, 'floor', 'floors', $numMap);
		echo(",");
		writeClass($xpath, 'street', 'streets', Array());
		echo(",");
		writeClass($xpath, 'label', 'labels', Array("labelTarget"=>"trg"));
		echo("}");
	}

?>
