var XDocument = (function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __ = function(xml){var _=this;
		xml = xml.replace(/[\n\r\t]/g, "");
		_.innerXML = xml;
		_.nodes = new Array();
		_._parseNodes();
		_._findRoot();
	}
	
	__.prototype = {
		_findRoot: function(){var _=this;
			for(var i=0; i<_.nodes.length; i++){
				var el = _.nodes[i];
				if(el.parent==null)
					_.root = el;
			}
		},
		
		_parseNodes: function(){var _=this;
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
		},
		
		getElementById: function(id){var _=this;
			for(var i=0;i<_.nodes.length;i++){
				var nd = _.nodes[i];
				if(nd.getAttribute("id")==id)
					return nd;
			}
			return null;
		},
		
		getElementByInnerId: function(id){var _=this;
			for(var i=0; i<_.nodes.length; i++){
				var el = _.nodes[i];
				if(el.innerId==id)
					return el;
			}
			return null;
		},
		
		getElementsByTagName: function(tgNm){
			var coll = new Array();
			for(var i=0; i<this.nodes.length; i++){
				var el = this.nodes[i];
				if(el.tagName==tgNm)
					coll.push(el);
			}
			return coll;
		}
	
	};
	

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
	};
	
	extend(XNode.prototype, {
		getInnerXML: function(){var _=this;
			var xml = "";
			for(var i=0; i<_.childNodes.length; i++){
				var nd = _.childNodes[i];
				xml+=nd.getOuterXML();
			}
			return xml;
		},
		
		getOuterXML: function(){var _=this;
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
		},
		
		getAttribute: function(name){
			var att = this.getAttributeNode(name);
			return att==null?null:att.value;
		},
		
		getAttributeNode: function(name){var _=this;
			for(var i=0; i<_.attributes.length; i++){
				var att = _.attributes[i];
				if(att.name==name)
					return att;
			}
			return null;
		},
		
		_parseChildren: function(){var _=this;
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
		},
		
		_parseAttributes: function(){
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
	});
	
	extend(XNode, {
		reSimpleNode: new RegExp("(<[^<>]+/>)|(<[^<>]+>[^<>]*</[^<>]+>)", "i"),
		reChildren: /&node(\d+);/g
	});

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
	
	extend(TextNode.prototype, {
		getInnerXML: function(){
			return this._text;
		},
		
		getOuterXML: function(){
			return this.getInnerXML();
		}
	});

	extend(__, {
		version: "1.0.0",
		XNode:XNode,
		TextNode:TextNode,
		AttributeNode:AttributeNode
	});
	
	return __;
})();
