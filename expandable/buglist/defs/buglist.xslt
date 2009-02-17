<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="Windows-1251" indent="yes"/>
	<xsl:template match="buglist">
		<html>
			<head>
				<style>
					body{
						background-color:#fafafa;
						font-size:12px;
						font-family:Arial, sans-serif;
					}
					.pointer{
						cursor:hand;
						cursor:pointer;
					}
					p{
						margin:0;
						padding:0;
					}
					p.category{
						color:#884400;
					}
					div.bug{
						font-family:verdana, sans-serif;
						margin:3px;
						padding:5px;
						border:1 solid black;
						background-color:#ffffff;
					}
					div.fixedBug{
						font-family:verdana, sans-serif;
						margin:3px;
						padding:5px;
						border:1 solid black;
						background-color:#e1e1e1;
						color:#888888;
					}
					div.details{
						display:none;
					}
					span.field{
						margin:5px;
					}
					p.fixed{
						color:#000088;
					}
					p.supposition{
						font-style:italic;
						margin-top:3px;
						border-left:3 solid #888888;
						padding-left:3px;
					}
					p.statement{
						margin-top:3px;
						border-left:3 solid #cc2222;
						padding-left:3px;
					}
					p.todo{
						margin-top:3px;
						border-left:5 solid #22cc22;
						padding-left:3px;
					}
				</style>
				<script language="javascript"><![CDATA[
				function toggleDetails(id){
					var div = document.getElementById(id+"details");
					div.style.display = div.style.display=="block"?"none":"block";
				}
				]]></script>
			</head>
			<body>
				<h1>Ошибки приложения <br/>
					<xsl:value-of select="application"/>
				</h1>
				<xsl:if test="@comments">
					<p style="font-size:14px; font-style:italic; text-align:center;"><xsl:value-of select="@comments"/></p>
				</xsl:if>
				<p style="text-align:right;">
					всего ошибок:<xsl:value-of select="count(//bug)"/>
				</p>
				<xsl:apply-templates select="bugs/bug">
					<xsl:sort select="@priority" order="descending" data-type="number"/>
				</xsl:apply-templates>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="bug">
		<xsl:variable name="tester" select="@tester"/>
		<xsl:variable name="module" select="@module"/>
		<div onclick="toggleDetails('{@id}')">
			<xsl:choose>
				<xsl:when test="fixed"><xsl:attribute name="class">fixedBug pointer</xsl:attribute></xsl:when>
				<xsl:otherwise><xsl:attribute name="class">bug pointer</xsl:attribute></xsl:otherwise>
			</xsl:choose>
			<p>
				<xsl:choose>
					<xsl:when test="@priority">
						<xsl:value-of select="@priority"/>
					</xsl:when>
					<xsl:otherwise>0</xsl:otherwise>
				</xsl:choose>: 
				<span class="field"><xsl:value-of select="@id"/></span>
				<span class="field"><xsl:value-of select="@date"/></span>
				<span><xsl:value-of select="@title"/></span>
				<span class="field" style="color:#0000ff;"><xsl:value-of select="//person[@id=$tester]"/></span>
				<span class="field" style="color:#008800;"><xsl:value-of select="//module[@id=$module]"/></span>
			</p>
			<div style="margin:2px; color:#888888;" id="{@id}details" class="details"><xsl:apply-templates/></div>
		</div>
	</xsl:template>
	<xsl:template match="ref">
		<xsl:choose>
			<xsl:when test="@category">
				<xsl:variable name="category" select="@category"/>
				<p class="category"><xsl:value-of select="//category[@id=$category]"/></p>
			</xsl:when>
			<xsl:when test="@bug">
				<xsl:variable name="bug" select="@bug"/>
				<span style="text-decoration:underline;">
					<xsl:attribute name="title">
						<xsl:value-of select="//bug[@id=$bug]/@title"/>
					</xsl:attribute>
					<xsl:value-of select="@bug"/>
				</span>
			</xsl:when>
			<xsl:otherwise><span style="color:red;">НЕДОПУСТИМАЯ ССЫЛКА</span></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="fixed">
		<xsl:variable name="programmer" select="@programmer"/>
		<p class="fixed">Fixed by <xsl:value-of select="//person[@id=$programmer]"/> <xsl:value-of select="@date"/> 
			<xsl:if test="text()">- <xsl:value-of select="."/></xsl:if>
		</p>
	</xsl:template>
	<xsl:template match="p"><p><xsl:apply-templates/></p></xsl:template>
	<xsl:template match="supposition"><p class="supposition"><xsl:apply-templates/></p></xsl:template>
	<xsl:template match="statement"><p class="statement"><xsl:apply-templates/></p></xsl:template>
	<xsl:template match="todo"><p class="todo"><xsl:apply-templates/></p></xsl:template>
</xsl:stylesheet>
