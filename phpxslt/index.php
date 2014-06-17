<?php
	$page = $_REQUEST["p"];
	if(empty($page)){
		$toc = new DOMDocument();
		$toc->load("data/toc.xml");
		$sect = $toc->getElementsByTagName('section')->item(0);
		$file = explode(".", $sect->getAttribute("file"));
		$page = $file[0];
	}

	function xml2html($xmldata, $xsl)
	{
		$xmlDoc = new DOMDocument();
		$xmlDoc->load($xmldata);

		$xslDoc = new DOMDocument();
		$xslDoc->load($xsl);

		$proc = new XSLTProcessor();
		$proc->importStylesheet($xslDoc);
		return $proc->transformToXML($xmlDoc);
	}

	if($page)
		echo(xml2html("data/pages/".$page.".xml", "defs/article.xslt"));

?>
