var PPrint = {};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	function each(coll, F){
		if(!coll)
			return;
		if(typeof(coll.length)=="undefined"){
			for(var k in coll)
				F(coll[k], k);
		}
		else{
			for(var i=0; i<coll.length; i++)
				F(coll[i], i);
		}
	}
	
	function contains(arr, val){
		for(var i=0; i<arr.length; i++){
			if(arr[i]==val)
				return true;
		}
		return false;
	}
	
	function repeat(str, count){
		var res = [];
		for(var i=0; i<count; i++)
			res.push(str);
		return res.join("");
	}
	
	var _ = PPrint;
	
	var lineBreak = "\r\n";
	var tab = "\t";
	
	var inlineTags = [
		"span", "b", "i", "u", "a"
	];
	
	function flatDocument(code){
		return code.replace(/\s*\r?\n\s*/g, "").replace(/\s+/g, " ");
	}

	
	function Document(code){var _=this;
		code = flatDocument(code);
		_.nodes = [];
		_.root = null;
		
		var reTag = /<(\/)?(\w+)(\s+[^>]+)?>/i;
		
		function findOpenTag(closingTag){
			closingTag.children = [];
			var prev = closingTag.prev;
			while(prev && (prev.closed || prev.name!=closingTag.name)){
				if(!prev.closing && !prev.closed)
					prev.closed;
				if(!prev.parent){
					prev.parent = closingTag;
					closingTag.children.push(prev);
				}
				prev = prev.prev;
			}
			if(!prev)
				return null;
			prev.corresponding = closingTag;
			prev.children = closingTag.children;
			prev.level = closingTag.level;
			closingTag.corresponding = prev;
			prev.closed = true;
			return prev;
		}
		
		function setLevel(tag, level){
			console.log("setLevel(", tag.name, "("+tag.idx+"), ", level, ")");
			tag.level = level;
			if(tag.corresponding)
				tag.corresponding.level = level;
			each(tag.children, function(chld){
				setLevel(chld, level+1);
			});
		}
		
		var prevTag = null;
		
		for(var pos=0, tag=""; pos<code.length; pos+=(tag.tag.length+textNode.length)){
			var tail = code.substr(pos, code.length-pos);
			var mt = tail.match(reTag);
			if(!mt){
				_.nodes.push({name:"#text", val:tail});
				break;
			}
			// found items: 
			var textNode = tail.substr(0, mt.index);
			tag = mt[0];
			var tagClosing = mt[1]!=null;
			
			var tag = {
				root:pos?false:true,
				name:mt[2],
				closing: mt[1]!=null,
				closed:false,
				corresponding:false,
				tag:mt[0],
				prev: prevTag,
				idx:_.nodes.length,
				level:0
			};
			
			if(tag.root)
				_.root = tag;
			
			if(tag.closing)
				findOpenTag(tag);
			
			if(textNode.length){
				var tnd = {name:"#text", val:textNode, parent:prevTag};
				_.nodes.push(tnd);
				//prevTag.children.push(tnd);
			}
			_.nodes.push(tag);
			prevTag = tag;
			
		}
		
		setLevel(_.root, 0);
	}
	
	Document.prototype = {
		prettyPrint: function(){var _=this;
			var code = [];
			
			function indent(tag){
				console.log("indent for", tag.name, "("+tag.idx+"), tag.level", tag.level);
				if(contains(inlineTags, tag.name.toLowerCase()))
					return "";
				return (tag.root?"":lineBreak)+ repeat(tab, tag.level);
			}
			var prevText = "";
			each(_.nodes, function(nd, i){
				if(nd.name=="#text"){
					prevText = nd.val;
				}
				else{
					if(!nd.closing){
						if(!nd.corresponding){
							code.push(prevText);
							code.push(indent(nd));
							code.push(nd.tag);
							prevText = "";
						}
						else{
							code.push(indent(nd));
							code.push(nd.tag);
						}
					}
					else{
						if(nd.prev==nd.corresponding){
							code.push(prevText);
							code.push(nd.tag);
						}
						else{
							if(prevText.length){
								code.push(indent(nd)+tab);
								code.push(prevText);
							}
							
							code.push(indent(nd));
							code.push(nd.tag);
						}
						prevText = "";
					}
				}
			});
			
			return code.join("");
		}
	};
	
	
	
	extend(_, {
		version: "1.0.0",
		
		flatDocument: flatDocument,
		
		formatDocument: function(code){
			return new Document(code).prettyPrint();
		}
	});
})();
