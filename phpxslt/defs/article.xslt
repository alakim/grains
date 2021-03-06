﻿<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bs="http://www.bicyclesoft.com/xPublish">
	<xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>
	
	<xsl:variable name="debugMode">
		<xsl:if test="/article/@debug='true'">true</xsl:if>
	</xsl:variable>

	<xsl:template match="/article">
		<xsl:variable name="tocdoc" select="document('../data/toc.xml')"/>
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
				<link rel="stylesheet" type="text/css" href="styles.css"/>
				<script type="text/javascript" src="js/lib/html.js"></script>
				<script type="text/javascript" src="js/lib/jquery-1.11.0.min.js"></script>
				<xsl:if test="$tocdoc/toc/@staticMenu!='true'">
					<script type="text/javascript" src="js/menuView.js"></script>
				</xsl:if>
				<xsl:choose>
					<xsl:when test="$debugMode='true'">
						<script type="text/javascript" src="js/debugView.js"></script>
						<xsl:if test="$tocdoc/toc/@staticMenu!='true'">
							<script type="text/javascript" src="menu.php?debug"></script>
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="$tocdoc/toc/@staticMenu!='true'">
							<script type="text/javascript" src="menu.php"></script>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
			</head>
			<body>
				<h1><xsl:value-of select="$tocdoc/toc/@title"/></h1>
				<table border="0" cellpadding="3" cellspacing="0">
					<tr>
						<td width="300" id="menuPnl" valign="top">
							<xsl:if test="$tocdoc/toc/@staticMenu='true'">
								<!--xsl:apply-templates select="$tocdoc/toc"/-->
								<xsl:call-template name="menu"/>
							</xsl:if>
						</td>
						<td valign="top">
							<h2><xsl:value-of select="@title"/></h2>
							<xsl:apply-templates />
						</td>
					</tr>
				</table>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="menu">
		<xsl:variable name="doc" select="document('../cache/menu.xml')"/>
		<ul>
			<xsl:apply-templates select="$doc/menu/section" mode="menu"/>
		</ul>
	</xsl:template>
	
	<xsl:template match="section" mode="menu">
		<xsl:variable name="file">
			<xsl:choose>
				<xsl:when test="@file"><xsl:value-of select="@file"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="ancestor::section[@file]/@file"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<li>
			<xsl:choose>
				<xsl:when test="@file or @anchor">
					<a href="?p={$file}#{@anchor}"><xsl:value-of select="@title"/></a>
				</xsl:when>
				<xsl:otherwise><xsl:value-of select="@title"/></xsl:otherwise>
			</xsl:choose>
			
			<xsl:if test="section">
				<ul>
					<xsl:apply-templates select="section" mode="menu"/>
				</ul>
			</xsl:if>
		</li>
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
	
	<xsl:include href="tags.xslt"/>
	
</xsl:stylesheet>
