<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bs="http://www.bicyclesoft.com/xPublish">
	<xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
	


	<xsl:template match="/article">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
				<link rel="stylesheet" type="text/css" href="styles.css"/>
				<script type="text/javascript" src="js/lib/html.js"></script>
				<script type="text/javascript" src="js/lib/jquery-1.11.0.min.js"></script>
				<script type="text/javascript" src="js/menuView.js"></script>
				<script type="text/javascript" src="menu.php"></script>
			</head>
			<body>
				<h1><xsl:value-of select="document('../data/toc.xml')/toc/@title"/></h1>
				<table border="0" cellpadding="3" cellspacing="0">
					<tr>
						<td width="300" id="menuPnl" valign="top"></td>
						<td valign="top">
							<h2><xsl:value-of select="@title"/></h2>
							<xsl:apply-templates />
						</td>
					</tr>
				</table>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template match="section">
		<xsl:variable name="sID">
			<xsl:choose>
				<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
				<xsl:otherwise>s<xsl:value-of select="count(preceding::section)+count(ancestor::section)"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="level" select="count(ancestor::section)+3"/>
		<a name="{$sID}"></a>
		<xsl:element name="h{$level}"><xsl:value-of select="@title"/></xsl:element>
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="p">
		<p><xsl:apply-templates/></p>
	</xsl:template>
	
	<xsl:template match="ref">
		<xsl:choose>
			<xsl:when test="@mail">
				<a href="mailto:{@mail}">
					<xsl:choose>
						<xsl:when test="text()"><xsl:value-of select="text()"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="@mail"/></xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@url">
				<a href="{@url}">
					<xsl:choose>
						<xsl:when test="text()"><xsl:value-of select="text()"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="@url"/></xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:when>
			<xsl:when test="@pict">
				<xsl:variable name="pictID" select="@pict"/>
				рис.<xsl:value-of select="count(document('../data/pictures.xml')/pictures/pict[@id=$pictID]/preceding::pict)+1"/>
			</xsl:when>
			<xsl:when test="@sect">
				<xsl:variable name="pageID" select="substring-before(@sect, '#')"/>
				<xsl:variable name="sectID" select="substring-after(@sect, '#')"/>
				<a href="/?p={$pageID}#{$sectID}"><xsl:apply-templates/></a>
			</xsl:when>
			<xsl:otherwise><xsl:apply-templates/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="attention">
		<div class="attention">
			<xsl:apply-templates/>
		</div>
	</xsl:template>

	<xsl:template match="pict">
		<div style="text-align:center;">
			<xsl:variable name="pictID" select="@id"/>
			<xsl:variable name="registry" select="document('../data/pictures.xml')"/>
			<xsl:variable name="pict" select="$registry/pictures/pict[@id=$pictID]"/>
			<img src="{$registry/pictures/@baseUrl}/{$pict/@file}"/>
			<p>Рис. <xsl:value-of select="count($pict/preceding::pict)+1"/> - <xsl:value-of select="$pict/text()"/></p>
		</div>
	</xsl:template>

	<xsl:template match="img">
		<xsl:variable name="imgID" select="@id"/>
		<xsl:variable name="registry" select="document('../data/pictures.xml')"/>
		<xsl:variable name="img" select="$registry/pictures/img[@id=$imgID]"/>
		<img src="{$registry/pictures/@baseUrl}/{$img/@file}"/>
	</xsl:template>
	
	<xsl:template match="list">
		<xsl:variable name="tag">
			<xsl:choose>
				<xsl:when test="@marker='num'">ol</xsl:when>
				<xsl:otherwise>ul</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:if test="caption">
			<xsl:apply-templates select="caption" mode="outside"/>
		</xsl:if>
		<xsl:element name="{$tag}">
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="li"><li><xsl:apply-templates/></li></xsl:template>
	<xsl:template match="caption"/>
	<xsl:template match="caption" mode="outside">
		<p class="listCaption"><xsl:apply-templates/></p>
	</xsl:template>
	
	
</xsl:stylesheet>
