﻿<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bs="http://www.bicyclesoft.com/xPublish">
	<xsl:output method="xml" version="1.0" encoding="utf-8" indent="yes"/>
	


	<xsl:template match="/toc">
		<menu>
			<xsl:apply-templates select="section"/>
			<xsl:if test="@debug='true'">
				<xsl:apply-templates select="section" mode="debug"/>
			</xsl:if>
		</menu>
	</xsl:template>
	
	
	
	<xsl:template match="section[@title]">
		<section title="{@title}">
			<xsl:apply-templates />
		</section>
	</xsl:template>
	
	<xsl:template match="section">
		<xsl:variable name="file">../data/pages/<xsl:value-of select="@file"/></xsl:variable>
		<xsl:variable name="doc" select="document($file)"/>
		<xsl:variable name="id" select="substring-before(@file, '.')"/>
		<xsl:variable name="title" select="$doc/article/@title"/>
		<section file="{$id}" title="{$title}">
			<xsl:apply-templates select="$doc/article/section" mode="sub"/>
		</section>
	</xsl:template>
		
				
	<xsl:template match="section" mode="sub">
		<xsl:variable name="sID">
			<xsl:choose>
				<xsl:when test="@id"><xsl:value-of select="@id"/></xsl:when>
				<xsl:otherwise>s<xsl:value-of select="count(preceding::section)+count(ancestor::section)"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<section anchor="{$sID}" title="{@title}">
			<xsl:apply-templates select="section" mode="sub"/>
		</section>
	</xsl:template>
	
	<xsl:template match="section[@title]" mode="debug">
		<xsl:apply-templates select="section" mode="debug"/>
	</xsl:template>
				
	<xsl:template match="section" mode="debug">
		<xsl:variable name="file">../data/pages/<xsl:value-of select="@file"/></xsl:variable>
		<xsl:variable name="doc" select="document($file)"/>
		
		<xsl:if test="$doc//todo">
			<todo id="{substring-before(@file, '.')}" message=""/>
		</xsl:if>
		<xsl:apply-templates select="section" mode="debug"/>
	</xsl:template>
	
</xsl:stylesheet>
