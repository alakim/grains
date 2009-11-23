<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="Windows-1251" indent="yes"/>
	<xsl:variable name="indent_per_section">40</xsl:variable>
	<!--xsl:variable name="mode">release</xsl:variable-->
	<!--xsl:variable name="mode">display</xsl:variable-->
	<xsl:variable name="mode">display</xsl:variable>
	<!-- Задание способа подключения таблицы стилей 
	shared - внешняя таблица стилей
	included - таблица, встроенная в документ
-->
	<xsl:variable name="standard-Id-label"/>
	<!--xsl:variable name="cssmode">shared</xsl:variable-->
	<xsl:variable name="cssmode">included</xsl:variable>
	<xsl:template match="article">
		<html>
			<head>
				<xsl:call-template name="css"/>
				<script language="javascript">
				var bThesis = false;

				function ThesisToggle(){
					var thes = document.getElementsByTagName("span");
					bThesis = !bThesis;
					
					for(var i=0; i&lt;thes.length; i++){
						if(thes[i].className=="thesis")
							thes[i].style.display = bThesis?"block":"none";
					}
				}
				</script>
				<style>
			span.thesis{
				display:block;
			}
			
		</style>
			</head>
			<body>
				<!--input type="button" value="Thesis view" onclick="ThesisToggle()"/-->
				<a name="toc"/>
				<xsl:apply-templates select="*[local-name()!='book']"/>
				<xsl:if test="book">
					<h2>
						<a name="books">Литература</a>
					</h2>
					<p class="tocmenu" onclick="window.navigate('#toc')" style="cursor:hand;" title="К оглавлению">&#160;</p>
					<xsl:apply-templates select="book"/>
				</xsl:if>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="section">
		<xsl:if test="@id">
			<a name="{@id}"/>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="@viewmode='normal'">
				<xsl:call-template name="normal-section"/>
			</xsl:when>
			<xsl:when test="@viewmode='table'">
				<xsl:call-template name="table-section"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="normal-section"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="normal-section">
		<xsl:variable name="level">h<xsl:value-of select="count(ancestor::section)+1"/>
		</xsl:variable>
		<xsl:variable name="indent">
			<xsl:value-of select="(count(ancestor::section)-1)*$indent_per_section"/>
		</xsl:variable>
		<xsl:element name="{$level}">
			<xsl:attribute name="style">margin-left:<xsl:value-of select="$indent"/>;</xsl:attribute>
			<a>
				<xsl:attribute name="name"><xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
				<xsl:if test="not(ancestor::section[@viewmode='table'])">
					<xsl:call-template name="head-number"/>&#160;
				</xsl:if>
			</a>
			<xsl:value-of select="@title"/>
		</xsl:element>
		<!--xsl:if test="$level='h1'">
			<div class="topMenu">
				<table border="0" cellpadding="0" cellspacing="0" width="100%">
					<tr>
						<td>&#160;</td>
						<td align="left" width="150">
							<a href="http://W1011/alakim/xart/index.htm">главная страница</a>
						</td>
						<td align="left" width="100">
							<a href="http://W1011/alakim/xart/abstracts.htm">конспекты</a>
						</td>
						<td align="left" width="100">
							<a href="http://W1011/alakim/xart/docs.htm">документация</a>
						</td>
					</tr>
				</table>
			</div>
		</xsl:if-->
		<xsl:choose>
			<xsl:when test="name(parent::*)='article'">
				<xsl:call-template name="toc"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="not(ancestor::section[@viewmode='table'])">
					<xsl:call-template name="tocmenu"/>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template name="table-section">
		<xsl:variable name="level">h<xsl:value-of select="count(ancestor::section)+1"/>
		</xsl:variable>
		<xsl:variable name="indent">
			<xsl:value-of select="(count(ancestor::section)-1)*$indent_per_section"/>
		</xsl:variable>
		<xsl:element name="{$level}">
			<xsl:attribute name="style">margin-left:<xsl:value-of select="$indent"/>;</xsl:attribute>
			<a>
				<xsl:attribute name="name"><xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
				<xsl:call-template name="head-number"/>&#160;
			<xsl:value-of select="@title"/>
			</a>
		</xsl:element>
		<xsl:call-template name="tocmenu"/>
		<xsl:apply-templates select="*[local-name(.)!='section']"/>
		<table border="1" cellpadding="3" cellspacing="0" width="100%">
			<xsl:for-each select="section">
				<tr>
					<th valign="top" style="background-color:#eeeeee; color:#000000; padding:10px;" width="10%">
						<a>
							<xsl:attribute name="name"><xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
							<xsl:value-of select="@title"/>
						</a>
					</th>
					<td valign="top">
						<xsl:apply-templates/>
					</td>
				</tr>
			</xsl:for-each>
		</table>
	</xsl:template>
	<xsl:template name="toc">
		<xsl:if test="section">
			<ul class="toc">
				<xsl:apply-templates select="section[@displayInTOC='yes']" mode="toc"/>
				<xsl:if test="name(parent::*)='article'">
					<xsl:if test="//book">
						<li>
							<a href="#books">Литература</a>
						</li>
					</xsl:if>
				</xsl:if>
			</ul>
		</xsl:if>
	</xsl:template>
	<xsl:template name="tocmenu">
		<xsl:variable name="indent">
			<xsl:value-of select="(count(ancestor::section)-1)*$indent_per_section"/>
		</xsl:variable>
		<p class="tocmenu" onclick="window.navigate('#toc')" style="cursor:hand;" title="К оглавлению">&#160;
		<xsl:attribute name="style">margin-left:<xsl:value-of select="$indent"/>;</xsl:attribute>
			<a>
				<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(parent::section), $standard-Id-label)"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="parent::section/@title"/></xsl:attribute>
				&#x25B2;<xsl:value-of select="parent::section/@title"/>
			</a>
			&#160;&#160;&#160;&#160;&#160;<xsl:apply-templates select="section" mode="tocmenu"/>
		</p>
	</xsl:template>
	<xsl:template name="subtitle-number">
		<xsl:value-of select="count(preceding-sibling::section)+1"/>
	</xsl:template>
	<xsl:template name="head-number">
		<xsl:if test="parent::section">
			<xsl:for-each select="ancestor::section">
				<xsl:if test="parent::section">
					<xsl:call-template name="subtitle-number"/>.</xsl:if>
			</xsl:for-each>
			<xsl:call-template name="subtitle-number"/>
		</xsl:if>
	</xsl:template>
	<xsl:template match="section" mode="toc">
		<li>
			<a>
				<xsl:attribute name="href">#
				<xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
				<xsl:call-template name="head-number"/>&#160;
			<xsl:value-of select="@title"/>
			</a>
		</li>
		<xsl:call-template name="toc"/>
	</xsl:template>
	<xsl:template match="section" mode="tocmenu">
		<nobr>
			<a>
				<xsl:attribute name="href">#
				<xsl:value-of select="substring-after(generate-id(), $standard-Id-label)"/></xsl:attribute>
				<xsl:attribute name="title"><xsl:value-of select="@title"/></xsl:attribute>
				<!--&#8226;--> &#x25bc; &#160;<xsl:value-of select="@title"/>
			</a>&#160;
	</nobr>
	</xsl:template>
	<xsl:template match="thesis">
		<div class="thesis">
			<span class="thesis">
				<xsl:value-of select="@dsc"/>
			</span>
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="p">
		<p>
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="code">
		<xsl:choose>
			<xsl:when test="parent::section">
				<pre class="code">
					<xsl:apply-templates/>
				</pre>
			</xsl:when>
			<xsl:when test="parent::optional">
				<pre class="code">
					<xsl:apply-templates/>
				</pre>
			</xsl:when>
			<xsl:otherwise>
				<span class="code">
					<xsl:apply-templates/>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="file">
		<span class="file">
			<xsl:value-of select="."/>
		</span>
	</xsl:template>
	<xsl:template match="optional">
		<p>
			<xsl:apply-templates select="caption" mode="optional"/>&#160;&#160;
		<span id="{substring-after(generate-id(), $standard-Id-label)}ctrl" style="color:#ffffff; background-color:#888888; padding:2px; font-size:70%; font-weight:bold; cursor:hand;" onclick="{substring-after(generate-id(), $standard-Id-label)}.style.display=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'none':'block'; {substring-after(generate-id(), $standard-Id-label)}ctrl.innerText=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'&#160;скрыть&#160;&#160;':'показать'">показать</span>
		</p>
		<div id="{substring-after(generate-id(), $standard-Id-label)}">
			<xsl:attribute name="style">
			display:none;
			border-left:solid 1 gray;
			border-top:solid 1 gray;
			border-right:solid 10 gray;
			border-bottom:solid 10 gray;
			padding:4px;
			margin-left:20px;
			margin-right:20px;
		</xsl:attribute>
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="caption" mode="optional">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="cmd">
		<pre class="cmd">
			<xsl:apply-templates/>
		</pre>
	</xsl:template>
	<xsl:template match="list">
		<xsl:apply-templates select="caption" mode="list"/>
		<xsl:variable name="listtype">
			<xsl:choose>
				<xsl:when test="@marker='num'">ol</xsl:when>
				<xsl:otherwise>ul</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:element name="{$listtype}">
			<xsl:if test="@marker = 'none'">
				<xsl:attribute name="style">list-style-type:none;</xsl:attribute>
			</xsl:if>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="li">
		<li>
			<xsl:if test="@name"><b><xsl:value-of select="@name"/></b> - </xsl:if>
			<xsl:apply-templates/>
		</li>
	</xsl:template>
	<xsl:template match="caption" mode="list">
		<p>
			<xsl:apply-templates/>:</p>
	</xsl:template>
	<xsl:template match="caption"/>
	<xsl:template match="picture">
		<center>
			<img src="{@src}"/>
			<p class="picdsc">
				<xsl:value-of select="."/>
			</p>
		</center>
	</xsl:template>
	<xsl:template match="table">
		<table border="1" cellpadding="3" cellspacing="0">
			<xsl:apply-templates/>
		</table>
	</xsl:template>
	<xsl:template match="th | td | tr">
		<xsl:copy>
			<xsl:apply-templates/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ref">
		<xsl:choose>
			<xsl:when test="@url">
				<a href="{@url}">
					<xsl:value-of select="."/>
				</a>
			</xsl:when>
			<xsl:when test="@xart">
				<xsl:variable name="doc">
					<xsl:value-of select="@xart"/>
				</xsl:variable>
				<xsl:variable name="fileRef">
					<xsl:value-of select="substring-before($doc, '.')"/>.html
				</xsl:variable>
				<a href="{$fileRef}">
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="document($doc)//article/section/@title"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@xSoftClass">
				<xsl:variable name="doc">
					<xsl:value-of select="@xSoftClass"/>
				</xsl:variable>
				<xsl:variable name="fileRef">
					<xsl:value-of select="substring-before($doc, '.')"/>.html
				</xsl:variable>
				<a href="{$fileRef}">
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>Класс <xsl:value-of select="document($doc)//class/@name"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@sect">
				<xsl:variable name="id">
					<xsl:value-of select="@sect"/>
				</xsl:variable>
				<a>
					<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(//section[@id = $id]), $standard-Id-label)"/></xsl:attribute>
					<xsl:attribute name="title">см. "<xsl:value-of select="//section[@id = $id]/@title"/>"</xsl:attribute>
					<xsl:choose>
						<xsl:when test="text()">
							<xsl:value-of select="."/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="//section[@id = $id]/@title"/>
						</xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@book">
			[<a>
					<xsl:attribute name="href">#<xsl:value-of select="substring-after(generate-id(id(@book)), $standard-Id-label)"/></xsl:attribute>
					<xsl:value-of select="count(id(@book)/preceding::book)+1"/>
				</a>]
		</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="img">
		<img src="{@src}"/>
	</xsl:template>
	<xsl:template match="cit">
		<p class="cit">
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="note">
		<xsl:choose>
			<xsl:when test="parent::section">
				<p class="note">
					<xsl:apply-templates/>
				</p>
			</xsl:when>
			<xsl:otherwise>
				<span class="note">
					<xsl:apply-templates/>
				</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="srctext">
		<p class="srctext">
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template match="class">
		<span class="class">
			<xsl:value-of select="."/>
		</span>
	</xsl:template>
	<xsl:template match="sel">
		<xsl:choose>
			<!--xsl:when test="parent::cmd"><span style="color:#88ff88;"><xsl:apply-templates/></span></xsl:when-->
			<xsl:when test="parent::cmd">
				<span style="padding:2px; background-color:#707070;">
					<xsl:apply-templates/>
				</span>
			</xsl:when>
			<xsl:when test="parent::code">
				<span style="background-color:#cccccc; font-weight:normal;">
					<xsl:apply-templates/>
				</span>
			</xsl:when>
			<!--xsl:when test="parent::code"><span style="font-weight:bold;"><xsl:apply-templates/></span></xsl:when-->
			<xsl:otherwise>
				<b>
					<xsl:apply-templates/>
				</b>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="notice">
		<xsl:choose>
			<xsl:when test="parent::li">
				<span class="opennotice" onclick="{substring-after(generate-id(), $standard-Id-label)}.style.display=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'none':'block'">...</span>
				<div class="hiddennotice" onclick="this.style.display='none'" id="{substring-after(generate-id(), $standard-Id-label)}">
					<xsl:apply-templates/>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div class="notice">
					<xsl:apply-templates/>
				</div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="attention">
		<div class="attention">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="conclusion">
		<div class="conclusion">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template name="css">
		<xsl:choose>
			<xsl:when test="$cssmode = 'included'">
				<style>body
{
	background-color: #ffffff;
	color: #000000;
	font-family: arial, sans-serif;
	margin:10px;
	margin-top:0px;
}
h1{
	text-align:center;
	font-size:200%;
	background-color:#444444;
	color:#ffffff;
	padding:8px;
	margin-bottom:0px;
	margin-right:-10px;
}


h2{
	text-align:left;
	margin-bottom:0px;
	margin-top:30px;
	font-size:180%;
}
h3{
	text-align:left;
	margin-bottom:0px;
	margin-top:10px;
	font-size:140%;
}
h4{
	text-align:left;
	margin-bottom:0px;
	font-size:120%;
}
p{
	margin-top:10px;
	margin-bottom:0px;
	text-indent:20px;
}
span.thesis{
	background-color:yellow;
}
div.thesis{
	border: 1 solid black;
	margin:3px;
}
pre.code{
	background-color:#f4f4f4;
	padding:10px;
	margin-left:30px;
	margin-right:30px;
}
span.code{
	font-family:courier new, monospace;
}
pre.cmd{
	background-color:#222222;
	color:#aaffff;
	padding:10px;
	margin-left:30px;
	margin-right:30px;
	font-family:Lucida console, Lucida Sans Unicode, monospace;
	font-size:14px;
}

ul, ol{
	margin-left:40px;
}

p.cit{
	background-color:#eeeeff;
	padding:3px;
	font-size:80%;
}

.note{
	background-color:#aaeeff;
	padding:3px;
	font-size:80%;
}

p.srctext{
	background-color:#eeffee;
	padding:3px;
	font-size:80%;
	border:1 solid red;
}
ul.toc{
	list-style-type:none;
	margin-top:0px;
	background-color:#ebebeb;
	font-size:12px;
	margin-left:2px;
	padding-left:40px;
}
ul.toc a:visited{
	color:black;
	text-decoration:none;
}
ul.toc a:link{
	color:black;
	text-decoration:none;
}
ul.toc a:hover{
	color:white;
	background-color:black;
	text-decoration:none;
}
span.class{
	font-family:courier, monospace;
}
p.tocmenu{
	text-align:center;
	/*background-color:#ebebeb;*/
	background-color:#777777;
	font-size:10px;
	padding:0px;
	margin-top:0px;
	margin-bottom:10px;
}
p.tocmenu a:link{
	color:white;
	font-weight:bold;
	text-decoration:none;
}
p.tocmenu a:visited{
	color:white;
	font-weight:bold;
	text-decoration:none;
}
p.tocmenu a:hover{
	background-color:#000000;
	font-weight:bold;
	text-decoration:none;
}
div.notice{
	border-left: 2 solid black;
	padding-left:5px;
	margin:10px;
	margin-left:30px;
	margin-right:30px;
	font-size:80%;
	font-style:italic;
}
div.attention{
	border-left: 6 solid red;
	padding-left:5px;
	margin:10px;
	margin-left:30px;
	margin-right:30px;
	font-size:80%;
	font-style:italic;
}
div.conclusion{
	padding:5px;
	border:4 solid #999999;
	margin:10px;
	margin-left:20px;
	margin-right:20px;
}
p.picdsc{
	font-style:italic;
	font-family:times new roman cyr, serif;
}
div.definition{
	margin-left:50px;
	margin-right:50px;
	margin-top:5px;
	background-color:#ffffff;
	border-left: 6 double #444488;
	padding:2px;
	padding-left:10px;
}
.hiddennotice{
	font-size:70%;
	background-color:#efefef;
	display:none;
	margin-left:50px;
	cursor:hand;
	
}
span.opennotice{
	font-size:150%;
	color:blue;
	/*text-decoration:underline;*/
	cursor:hand;
}
span.file{
	font-family: Courier, monospace; 
	font-style:normal;
}

div.topMenu{
	background-color:#888888;
	margin-bottom:5px;
	margin-left:-10px;
	margin-right:-10px;
}

div.topMenu a:link{
	text-decoration:none;
	color:#cccccc;
	font-weight:bold;
	font-size:12px;
}
div.topMenu a:visited{
	text-decoration:none;
	color:#cccccc;
	font-weight:bold;
	font-size:12px;
}
div.topMenu a:hover{
	text-decoration:none;
	color:white;
	font-weight:bold;
	font-size:12px;
}
</style>
			</xsl:when>
			<xsl:otherwise>
				<link rel="stylesheet" type="text/css" href="h:/xmldefs/xart/styles.css"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="definition">
		<div class="definition">
			<xsl:apply-templates/>
		</div>
	</xsl:template>
	<xsl:template match="objTable">
		<xsl:variable name="this" select="."/>
		<center>
			<table border="0" cellpadding="3" cellspacing="1" style="background-color:#aaaaaa;">
				<xsl:if test="@width">
					<xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute>
				</xsl:if>
				<xsl:if test="tblColumn[text()]">
					<tr style="background-color:#ffffff;">
						<xsl:apply-templates select="tblColumn"/>
					</tr>
				</xsl:if>
				<xsl:for-each select="tblObjects/*">
					<tr style="background-color:#ffffff;">
						<xsl:apply-templates select="$this/tblColumn" mode="obj">
							<xsl:with-param name="o" select="."/>
						</xsl:apply-templates>
					</tr>
				</xsl:for-each>
			</table>
		</center>
	</xsl:template>
	<xsl:template match="tblColumn">
		<th style="background-color:#eeeeee; color:#000000;">
			<xsl:value-of select="."/>
		</th>
	</xsl:template>
	<xsl:template match="tblColumn" mode="obj">
		<xsl:param name="o"/>
		<xsl:variable name="cond">
			<xsl:value-of select="@select"/>
		</xsl:variable>
		<td>
			<xsl:if test="@style">
				<xsl:attribute name="style"><xsl:value-of select="@style"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@align">
				<xsl:attribute name="align"><xsl:value-of select="@align"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@valign">
				<xsl:attribute name="valign"><xsl:value-of select="@valign"/></xsl:attribute>
			</xsl:if>
			<xsl:for-each select="$o">
				<xsl:choose>
					<xsl:when test="$cond='.'">
						<xsl:apply-templates/>
					</xsl:when>
					<xsl:when test="$cond='#'">
						<xsl:value-of select="count(preceding-sibling::node())+1"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@*[local-name(.)=$cond]"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</td>
	</xsl:template>
	<xsl:template match="book">
		<p>
			<a>
				<xsl:attribute name="name"><xsl:value-of select="substring-after(generate-id(.), $standard-Id-label)"/></xsl:attribute>
				<xsl:value-of select="count(preceding::book)+1"/>. <xsl:apply-templates/>
			</a>
		</p>
	</xsl:template>
	<xsl:template match="nobr">
		<nobr>
			<xsl:apply-templates/>
		</nobr>
	</xsl:template>
	<xsl:template match="cs_region">
		<div id="{substring-after(generate-id(), $standard-Id-label)}frm" style="border:1 solid gray; margin:4px;">#region <xsl:value-of select="@name"/>&#160;<span style="cursor:hand; background-color:#acacac;" onclick="{substring-after(generate-id(), $standard-Id-label)}.style.display=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'none':'block'; this.title=({substring-after(generate-id(), $standard-Id-label)}.style.display=='block')?'Скрыть':'Показать'">
				<xsl:attribute name="title"><xsl:choose><xsl:when test="@display='none'">Показать</xsl:when><xsl:when test="@display='block'">Скрыть</xsl:when></xsl:choose></xsl:attribute>[...]</span>
			<span id="{substring-after(generate-id(), $standard-Id-label)}">
				<xsl:attribute name="style">display='<xsl:value-of select="@display"/>'</xsl:attribute>
				<xsl:apply-templates/>
#endregion
</span>
		</div>
	</xsl:template>
</xsl:stylesheet>
