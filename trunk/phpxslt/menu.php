<?php
	if(isset($_REQUEST['debug'])){
		$debugMode = true;
	}

	function xml2html($xmldata, $xsl){
		global $debugMode;
		
		$xmlDoc = new DOMDocument();
		$xmlDoc->load($xmldata);
		if($debugMode==true){
			$root = $xmlDoc->documentElement;
			$root->setAttribute("debug", "true");
		}

		$xslDoc = new DOMDocument();
		$xslDoc->load($xsl);

		$proc = new XSLTProcessor();
		$proc->importStylesheet($xslDoc);
		return $proc->transformToXML($xmlDoc);
	}

	echo(xml2html("data/toc.xml", "defs/toc.xslt"));

?>
