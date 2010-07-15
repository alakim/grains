var XDocument = (function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	function lambda(F){
		if(typeof(F)=="function") return F;
		var lmb = F.split("|");
		return new Function(lmb[0], "return "+lmb[1]);
	}
	
	function find(coll, F){
		F = lambda(F);
		for(var i=0; i<coll.length; i++){
			var e = coll[i];
			if(F(e, i)) return e;
		}
	}
	function select(coll, F){
		F = lambda(F);
		var res = [];
		each(coll, function(e, i){
			if(F(e, i)) res.push(e);
		});
		return res;
	}
	
	function each(coll, F){
		if(!coll || !coll.length) return;
		for(var i=0; i<coll.length; i++)F(coll[i],i);
	}
	
	var __ = function(xml){var _=this;
		xml = xml.replace(/[\n\r\t]/g, "");
		_.innerXML = xml;
		_.nodes = new Array();
		parseNodes(_);
		_.root = find(_.nodes, "e|e.parent==null");
	}
	
	function parseNodes(_){
		var aMt;
		var xml = _.innerXML;
		while(aMt = xml.match(XNode.reSimpleNode)){
			var nodeXml = aMt[0];
			var nd = parseXmlNode(nodeXml, _);
			xml = xml.replace(nodeXml, "&node"+nd.innerId+";");
		}
		each(_.nodes, function(nd){
			if(nd instanceof XNode) parseChildren(nd);
		});
	}
	
	function parseXmlNode(xml, doc){
		var nd = new XNode(doc);
		nd._outerXML = xml;
		nd._innerXML = nd._outerXML.replace(/^<[^>]+>/i, "");
		nd._innerXML = nd._innerXML.replace(/<\/[^>]+>$/i, "");
		var mtTgNm = nd._outerXML.match(/^<([^ >]+)/i);
		nd.tagName = mtTgNm[1];
		return nd;
	}
	
	function parseChildren(_){
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
					_.childNodes.push(el);
					el.parent = _;
				}
			}
			else{
				var txt = new TextNode(xc, _.doc);
				_.childNodes.push(txt);
				txt.parent = _;
			}
		}
		
		parseAttributes(_);
	}
	
	function parseAttributes(_){
		var inTag = _._outerXML.match(/^<[^>]+>/)[0];
		var reAttExp = "([a-z0-9]+)\s*=\s*\"([^\"]+)\"";
		var reAttCollection = new RegExp(reAttExp, "ig")
		var reAtt = new RegExp(reAttExp, "i");
		var mtColl = inTag.match(reAttCollection);
		each(mtColl, function(att){
			var mt =  att.match(reAtt);
			new AttributeNode(mt[1], mt[2], _);
		});
	}

		
	__.prototype = {
		getElementById: function(id){var _=this;
			return find(_.nodes, function(nd){return nd.getAttribute("id")==id;});
		},
		
		getElementByInnerId: function(id){var _=this;
			return find(_.nodes, function(el){return el.innerId==id;});
		},
		
		getElementsByTagName: function(tgNm){var _=this;
			return select(_.nodes, function(nd){
				return nd.tagName==tgNm;
			});
		},
		
		createElement: function(elName){var _=this;
			var el = new XNode(_);
			el.tagName = elName;
			return el;
		},
		
		removeNode: function(node){var _=this;
			function notThis(n){return n.innerId!=node.innerId;};
			_.nodes = select(_.nodes, notThis);
			node.parent.childNodes = select(node.parent.childNodes, notThis);
		}
	};
	

	function XNode(doc){var _=this;
		doc.nodes.push(_);
		_.innerId = doc.nodes.length;
		_.doc = doc;
		_.childNodes = [];
		_.parent = null;
		_.attributes = [];
	};
	
	extend(XNode.prototype, {
		getInnerXML: function(){var _=this;
			var xml = "";
			each(_.childNodes, function(nd){xml+=nd.getOuterXML();});
			return xml;
		},
		
		getOuterXML: function(){var _=this;
			var xml = "<"+_.tagName;
			each(_.attributes, function(ndAtt){
				xml+=" "+ndAtt.name+"=\""+ndAtt.value+"\"";
			});
			var inner = _.getInnerXML();
			return xml + (inner.length?">"+inner+"</"+_.tagName+">" : "/>");
		},
		
		getAttribute: function(name){
			var att = this.getAttributeNode(name);
			return att==null?null:att.value;
		},
		
		getAttributeNode: function(name){var _=this;
			return find(_.attributes, function(att){
				return att.name==name;
			});
		},
		
		appendChild: function(nd){var _=this;
			_.childNodes.push(nd);
		},
		
		setAttribute: function(name, value){var _=this;
			var att = _.getAttributeNode(name);
			if(att) att.value = value;
			else new XDocument.AttributeNode(name, value, _);
		},
		
		removeAttribute: function(name){var _=this;
			_.attributes = select(_.attributes, function(a){return a.name!=name;});
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
		if(xNode) xNode.attributes.push(this);
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
		version: "1.2.328",
		XNode:XNode,
		TextNode:TextNode,
		AttributeNode:AttributeNode
	});
	
	return __;
})();
