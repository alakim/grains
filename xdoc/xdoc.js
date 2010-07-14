	function XDocument(xml){var _=this;
		xml = xml.replace(/[\n\r\t]/g, "");
		_.innerXML = xml;
		_.nodes = new Array();
		_._parseNodes();
		_._findRoot();
	}
	
	XDocument.prototype._findRoot = function(){var _=this;
		for(var i=0; i<_.nodes.length; i++){
			var el = _.nodes[i];
			if(el.parent==null)
				_.root = el;
		}
	}
	
	XDocument.prototype._parseNodes = function(){var _=this;
		var aMt;
		var xml = _.innerXML;
		while(aMt = xml.match(XNode.reSimpleNode)){
			var nodeXml = aMt[0];
			var nd = new XNode(nodeXml, _);
			xml = xml.replace(nodeXml, "&node"+nd.innerId+";");
		}
		for(var i=0; i<_.nodes.length; i++){
			var nd = _.nodes[i];
			if(nd.constructor==XNode)
				nd._parseChildren();
		}
	}
	
	XDocument.prototype.getElementById = function(id){var _=this;
		for(var i=0;i<_.nodes.length;i++){
			var nd = _.nodes[i];
			if(nd.getAttribute("id")==id)
				return nd;
		}
		return null;
	}
	
	XDocument.prototype.getElementByInnerId = function(id){var _=this;
		for(var i=0; i<_.nodes.length; i++){
			var el = _.nodes[i];
			if(el.innerId==id)
				return el;
		}
		return null;
	}
	
	XDocument.prototype.getElementsByTagName = function(tgNm){
		var coll = new Array();
		for(var i=0; i<this.nodes.length; i++){
			var el = this.nodes[i];
			if(el.tagName==tgNm)
				coll.push(el);
		}
		return coll;
	}

	function XNode(xml, doc){var _=this;
		_._outerXML = xml;
		_._innerXML = _._outerXML.replace(/^<[^>]+>/i, "");
		_._innerXML = _._innerXML.replace(/<\/[^>]+>$/i, "");
		var mtTgNm = this._outerXML.match(/^<([^ >]+)/i);
		_.tagName = mtTgNm[1];
		doc.nodes.push(_);
		_.innerId = doc.nodes.length;
		_.doc = doc;
		_.childNodes = new Array();
		_.parent = null;
		_.attributes = new Array();
	}
	
	XNode.prototype.getInnerXML = function(){var _=this;
		var xml = "";
		for(var i=0; i<_.childNodes.length; i++){
			var nd = _.childNodes[i];
			xml+=nd.getOuterXML();
		}
		return xml;
	}
	
	XNode.prototype.getOuterXML = function(){var _=this;
		var xml = "<"+_.tagName;
		for(var i=0; i<_.attributes.length; i++){
			var ndAtt = _.attributes[i];
			xml+=" "+ndAtt.name+"=\""+ndAtt.value+"\"";
		}
		var inner = _.getInnerXML();
		if(inner=="")
			xml+="/>";
		else
			xml+=">"+inner+"</"+_.tagName+">";
		return xml;
	}
	
	XNode.prototype.getAttribute = function(name){
		var att = this.getAttributeNode(name);
		return att==null?null:att.value;
	}
	
	XNode.prototype.getAttributeNode = function(name){var _=this;
		for(var i=0; i<_.attributes.length; i++){
			var att = _.attributes[i];
			if(att.name==name)
				return att;
		}
		return null;
	}
	
	XNode.prototype._parseChildren = function(){var _=this;
		var reNd = /^(.*)(&node\d+;)(?!&node\d+;)(.*)$/; 
		var mt;
		var str = _._innerXML;
		var arr = new Array();
		while(str!=null && str!="" && (mt = str.match(reNd))){
			arr.push(mt[3]);
			arr.push(mt[2]);
			str = mt[1];
		}
		arr.push(str);            
			
		for(var i=arr.length-1; i>=0; i--){
			var xc = arr[i].toString(); // child node
			if(xc.toString()=="")
				continue;
			if(xc.match(reNd)){
				var ndId = parseInt(xc.toString().match(/\d+/));
				var el = _.doc.getElementByInnerId(ndId);
				if(el!=null){
					this.childNodes.push(el);
					el.parent = _;
				}
			}
			else{
				var txt = new TextNode(xc, _.doc);
				_.childNodes.push(txt);
				txt.parent = _;
			}
		}
		
		_._parseAttributes();
	}
	
	XNode.prototype._parseAttributes = function(){
		var inTag = this._outerXML.match(/^<[^>]+>/)[0];
		var reAttExp = "([a-z0-9]+)\s*=\s*\"([^\"]+)\"";
		var reAttCollection = new RegExp(reAttExp, "ig")
		var reAtt = new RegExp(reAttExp, "i");
		var mtColl = inTag.match(reAttCollection);
		if(mtColl){
			for(var i=0; i<mtColl.length; i++){
				var att = mtColl[i];
				var mt =  att.match(reAtt);
				var attNd = new AttributeNode(mt[1], mt[2], this);
			}
		}
	}
	
	XNode.reSimpleNode = new RegExp("(<[^<>]+/>)|(<[^<>]+>[^<>]*</[^<>]+>)", "i");
	XNode.reChildren = /&node(\d+);/g;

	function AttributeNode(name, value, xNode){
		this.name = name;
		this.value = value;
		this.parent = xNode;
		xNode.attributes.push(this);
	}

	function TextNode(text, doc){
		this._text = text;
		this.doc = doc;
		this.parent = null;
		doc.nodes.push(this);
		this.innerId = doc.nodes.length;
	}
	
	TextNode.prototype.getInnerXML = function(){
		return this._text;
	}
	
	TextNode.prototype.getOuterXML = function(){
		return this.getInnerXML();
	}

		XDocument.performTest = function(testName, outPaneId){
			var div = document.getElementById(outPaneId);
			var test = eval(testName);
			var res = test();
			var html = "<p class=result style=\"color:"+(res==true?"green":"red")+"\">"+testName+": "+(res==true?"OK":res)+"</p>";
			div.innerHTML+=html;
		}
		
		XDocument.performAllTests = function(outPaneId){var _=XDocument;
			_.performTest("XDocument.testNodes", outPaneId);
			_.performTest("XDocument.testAccessors", outPaneId);
			_.performTest("XDocument.testLargeDoc", outPaneId);
			_.performTest("XDocument.testComplexDoc", outPaneId);
			_.performTest("XNode.testChildNodes", outPaneId);
			_.performTest("XNode.testChangeChildNodesCollection", outPaneId);
		}
		
		XDocument.prepareHtmlCode = function(code){
			code = code.replace(/&/g, "&amp;");
			code = code.replace(/</g, "&lt;");
			code = code.replace(/>/g, "&gt;");
			return code;
		}
	
	XDocument.testNodes = function(){var _=XDocument;
		var f1xml = "<field name=\"x\">abc</field>";
		var f2xml = "<field name=\"y\">123</field>";
		var xml = "<root>"+f1xml+f2xml+"</root>";
		var xDoc = new XDocument(xml);
		var aRoot = xDoc.getElementsByTagName("root");
		if(aRoot.length!=1)
			return "Ошибка 1: "+aRoot.length;
		var root = aRoot[0];
		if(!root)
			return "Ошибка 1.1: не найден кореневой элемент";
		if(root.constructor!=XNode)
			return "Ошибка 1.2: "+root.constructor;
		if(root.getOuterXML()!=xml)
			return "Ошибка 1.3: "+_.prepareHtmlCode(root.getOuterXML());
		var aFld = xDoc.getElementsByTagName("field");
		if(aFld.length!=2)
			return "Ошибка 2: "+aFld.length;
		if(aFld[0].getOuterXML()!=f1xml)
			return "Ошибка 2.1: "+_.prepareHtmlCode(aFld[0].getOuterXML());
		if(aFld[1].getOuterXML()!=f2xml)
			return "Ошибка 2.2: "+_.prepareHtmlCode(aFld[1].getOuterXML());
		return true;
	}
	
	XDocument.testAccessors = function(){var _=XDocument;
		var f1xml = "<field id=\"f1\" name=\"x\">abc</field>";
		var f2xml = "<field id=\"f2\" name=\"y\">123</field>";
		var xml = "<root>\n\t"+f1xml+"\n\t"+f2xml+"\n</root>";
		var xDoc = new XDocument(xml);
		var f1 = xDoc.getElementById("f1");
		if(!f1)
			return "Ошибка 1.1: не найдено поле";
		if(f1.getOuterXML()!=f1xml)
			return "Ошибка 1.2: "+_.prepareHtmlCode(f1.getOuterXML());
		var f2 = xDoc.getElementById("f2");
		if(!f2)
			return "Ошибка 2.1: не найдено поле";
		if(f2.getOuterXML()!=f2xml)
			return "Ошибка 2.2: "+_.prepareHtmlCode(f2.getOuterXML());
		
		var aFld = xDoc.getElementsByTagName("field");
		if(aFld.length!=2)
			return "Ошибка 3: "+aFld.length;
		if(aFld[0].getOuterXML()!=f1xml)
			return "Ошибка 3.1: "+_.prepareHtmlCode(aFld[0].getOuterXML());
		if(aFld[1].getOuterXML()!=f2xml)
			return "Ошибка 3.2: "+_.prepareHtmlCode(aFld[1].getOuterXML());
			
		return true;
	}
	
	XDocument.testLargeDoc = function(){var _=XDocument;
		var xml = "";
		for(var i=0; i<10; i++){
			xml+="\n\t<field name=\"fld"+i+"\">value "+i+"</field>";
		}
		xml = "<root>"+xml+"\n</root>";
		var xDoc = new XDocument(xml);
		var root = xDoc.getElementsByTagName("root")[0];
		if(root.childNodes.length!=10)
			return "Ошибка 1: "+root.childNodes.length;
		
		return true;
	}
	
	XDocument.testComplexDoc = function(){var _=XDocument;
		var xml = "";
		for(var j=0; j<20; j++){
			xml+="\n\t<chapter id=\"c"+j+"\">";
			for(var i=0; i<10; i++){
				xml+="\n\t\t<field name=\"fld"+i+"\">value "+i+"</field>";
			}
			xml+="\n\t</chapter>";
		}
		xml = "<root>"+xml+"\n</root>";
		var xDoc = new XDocument(xml);
		var root = xDoc.getElementsByTagName("root")[0];
		if(root.childNodes.length!=20)
			return "Ошибка 1: "+root.childNodes.length;
		
		for(var i=0;i<root.childNodes.length;i++){
			var ch = root.childNodes[i];
			if(ch.childNodes.length!=10)
				return "Ошибка 2."+i+": "+ch.childNodes.length;
		}
		
		return true;
	}	

	XNode.testChildNodes = function(){var _=XNode, _d=XDocument;
		var f1xml = "<field name=\"x\">abc</field>";
		var f2xml = "<field name=\"y\">123</field>";
		var xml = "<root>\n\t"+f1xml+"\n\t"+f2xml+"\n</root>";
		var resultXml = xml.replace(/[\n\t]/g, "");
		var xDoc = new XDocument(xml);
		var root = xDoc.getElementsByTagName("root")[0];
		if(root.childNodes.length!=2)
			return "Ошибка 1: "+root.childNodes.length;
		if(root.childNodes[0].getOuterXML()!=f1xml)
			return "Ошибка 2.1: "+_d.prepareHtmlCode(root.childNodes[0].getOuterXML());
		if(root.childNodes[1].getOuterXML()!=f2xml)
			return "Ошибка 2.2: "+_d.prepareHtmlCode(root.childNodes[1].getOuterXML());
		
		if(!root.childNodes[0].parent)
			return "Ошибка 3: "+root.childNodes[0].parent;
		if(root.childNodes[0].parent.getOuterXML()!=resultXml)
			return "Ошибка 3.1: "+_d.prepareHtmlCode(root.childNodes[0].parent.getOuterXML());
		return true;
	}
	
	XNode.testChangeChildNodesCollection = function(){var _=XNode, _d=XDocument;
		var f1xml = "<field id=\"f1\" name=\"x\">abc</field>";
		var f2xml = "<field id=\"f2\" name=\"y\">123</field>";
		var xml = "<root>\n\t"+f1xml+"\n\t"+f2xml+"\n</root>";
		var resultXml = xml.replace(/[\n\t]/g, "");
		var xDoc = new XDocument(xml);
		var root = xDoc.getElementsByTagName("root")[0];
		var a = [];
		for(var i=0;i<root.childNodes.length;i++){
			var nd = root.childNodes[i];
			a.push(nd);
		}
		root.childNodes = a;
		if(root.getOuterXML()!=resultXml)
			return "Ошибка 1: "+_d.prepareHtmlCode(root.getOuterXML());
		if(root.childNodes[0].getOuterXML()!=f1xml)
			return "Ошибка 2.1: "+_d.prepareHtmlCode(root.childNodes[0].getOuterXML());
		if(root.childNodes[1].getOuterXML()!=f2xml)
			return "Ошибка 2.2: "+_d.prepareHtmlCode(root.childNodes[1].getOuterXML());
		return true;
	}
