<?php
	include('html.php');
?>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>HTML Test</title>
	<style type="text/css">
		body{
			font-family: Verdana, Arial, Sans-Serif;
		}
		.message{
			color:#c54;
		}
	</style>
</head>
<body>
	<h1>HTML Test</h1>
	<p><a href="htmltest.php">Reload</a></p>
	
	<?php
	$cnt = 5;
	$markup = Html::div(
		Html::div("123"),
		Html::div(array('style'=>'color:red;'), "abcd", "efg", "hi"),
		Html::div("количество:", $cnt),
		Html::ul(
			Html::li("abc"),
			Html::li("def"),
			Html::li("ghi")
		)
	);
	
	echo($markup);
	?>
	
</body>
</html>