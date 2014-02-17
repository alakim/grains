<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:prj="http://schemas.microsoft.com/project">

 <xsl:output method="text" encoding="utf-8" indent="no"/>

 <xsl:template match="/" >
	"tasks":[
	<xsl:apply-templates select="//prj:Task"/>
	];
 </xsl:template>
 
 <xsl:template match="prj:Task">
	{"id":"<xsl:value-of select="prj:UID"/>", "name":"<xsl:value-of select="prj:Name"/>", "outlineNumber":"<xsl:value-of select="prj:OutlineNumber"/>", "start":"<xsl:value-of select="prj:Start"/>", "finish":"<xsl:value-of select="prj:Finish"/>"<xsl:if test="prj:PercentComplete">, "progress":<xsl:value-of select="prj:PercentComplete"/></xsl:if><xsl:if test="prj:PredecessorLink">, "predecessor":"<xsl:value-of select="prj:PredecessorLink/prj:PredecessorUID"/>"</xsl:if>}, </xsl:template>

</xsl:stylesheet>