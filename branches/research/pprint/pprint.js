var PPrint = {};

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	function each(coll, F){
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
		
		var prevTag = null;
		
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
			tag.level = level;
			each(tag.children, function(chld){
				setLevel(chld, level+1);
			});
		}
		
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
			
			if(textNode.length)
				_.nodes.push({name:"#text", val:textNode});
			_.nodes.push(tag);
			prevTag = tag;
			
		}
		
		setLevel(_.root, 0);
	}
	
	Document.prototype = {
		prettyPrint: function(){var _=this;
			var code = [];
			
			function indent(tag){
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
						code.push(indent(nd));
						code.push(nd.tag);
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
