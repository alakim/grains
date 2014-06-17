<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bs="http://www.bicyclesoft.com/xPublish">
	<xsl:output method="text" version="1.0" encoding="utf-8" indent="yes"/>
	


	<xsl:template match="/toc">
		$(function(){
			Menu([<xsl:apply-templates select="section"/>
				null
			]);
		});
	</xsl:template>
	
	<xsl:template match="section[@title]">
		{title:'<xsl:value-of select="@title"/>', sub:[<xsl:apply-templates /> null]},
	</xsl:template>
	
	<xsl:template match="section">
		<xsl:variable name="file">../data/pages/<xsl:value-of select="@file"/></xsl:variable>
		<xsl:variable name="doc" select="document($file)"/>
				{id:"<xsl:value-of select="substring-before(@file, '.')"/>", title:'<xsl:value-of select="$doc/article/@title"/>', sub:[<xsl:apply-templates select="$doc/article/section" mode="sub"/> null]},</xsl:template>
		
				
	<xsl:template match="section" mode="sub">
		<xsl:variable name="sID">
			<xsl:choose>
				<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
				<xsl:otherwise>s<xsl:value-of select="count(preceding::section)+count(ancestor::section)"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		{id:'<xsl:value-of select="$sID"/>', title:'<xsl:value-of select="@title"/>', sub:[<xsl:apply-templates select="section" mode="sub"/> null]},
	</xsl:template>
	
	
</xsl:stylesheet>
