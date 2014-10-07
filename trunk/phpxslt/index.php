<?php
	$clearCache = false;
	
	if(isset($_REQUEST['clearcache'])){
		$clearCache = true;
	}
	if(isset($_REQUEST['p'])){
		$page = $_REQUEST["p"];
	}
	if(isset($_REQUEST['debug'])){
		$debugMode = true;
	}
	if(empty($page)){
		$toc = new DOMDocument();
		$toc->load("data/toc.xml");
		$sect = $toc->getElementsByTagName('section')->item(0);
		$file = explode(".", $sect->getAttribute("file"));
		$page = $file[0];
	}
	
	function buildMenu(){
		$menu = xml2html("data/toc.xml", "defs/menu.xslt");
		file_put_contents("cache/menu.xml", $menu);
	}

	function xml2html($xmldata, $xsl){
		global $debugMode;
		$xmlDoc = new DOMDocument();
		$xmlDoc->load($xmldata);
		if($debugMode){
			$root = $xmlDoc->documentElement;
			$root->setAttribute("debug", "true");
		}

		$xslDoc = new DOMDocument();
		$xslDoc->load($xsl);

		$proc = new XSLTProcessor();
		$proc->importStylesheet($xslDoc);
		return $proc->transformToXML($xmlDoc);
	}
	
	if($clearCache || !file_exists("cache/menu.xml"))
		buildMenu();

	if($page)
		echo(xml2html("data/pages/".$page.".xml", "defs/article.xslt"));

?>
