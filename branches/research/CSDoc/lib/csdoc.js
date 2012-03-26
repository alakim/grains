if(typeof(Html)!="object") alert("html.js module required!");
if(typeof(jQuery)!="function") alert("jquery.js module required!");

var CSDoc = (function(){
	function each(coll,F){
		if(coll instanceof Array) for(var i=0;i<coll.length;i++)F(coll[i],i);
		else for(var k in coll)F(coll[k],k);
	}
	
	function traceDoc(xdoc){
		each(xdoc, function(v,k){
			if(typeof(v)=="function") console.log("function ", k);
			else if(typeof(v)=="object") console.log("object ", k);
		});
	}
	
	var templates = {

		table: function(){with(Html){
			return div(
				div({id:"tagsList"},
					apply(tags, function(lst, t){
						return span(span({"class":"action", onclick:callFunction("CSDoc.displayMembers", t)}, t), " ");
					})
				),
				div({id:"selectedMembersPnl"}),
				hr(),
				ul(
					apply(tree, templates.item)
				)
			);
		}},
		type: function(t){
			return t=="T"?"type"
				:t=="M"?"method"
				:t=="F"?"field"
				:t=="P"?"property"
				:t;
		},
		item: function(nd){with(Html){
			return li(
				nd.member?span({"class":"member", title:nd.member.description},
						templates.type(nd.member.type), " ",
						nd.name, " ",
						templates.tagsList(nd.member)
						// nd.member.tags?span({"class":"tagList"}, "&lt;", nd.member.tags, "&gt;"):null
					)
					:span({"class":"module"}, nd.name),
				ul({"class":"tree", title:nd.name},
					apply(nd.children, templates.item)
				)
			);
		}},
		selectedMembers: function(tagName){with(Html){
			return div(
				div({style:"font-weight:bold;"}, tagName, ":"),
				apply(tags[tagName], function(mmb){
					return div({title:mmb.description},
						mmb.fullName.replace(/\([^\)]*\)/, "()"), " ",
						templates.tagsList(mmb)
					);
				})
			);
		}},
		tagsList: function(mmb){with(Html){
			return mmb.tags?span({"class":"tagList"}, "&lt;", mmb.tags, "&gt;"):null;
		}}
	};
	
	var memberIndex = {};
	var entities = {};
	var tree = {};
	var tags = {};
	
	function addTreeNode(mmb){
		var nms = mmb.fullName.replace(/\([^\)]*\)/, "").split(".");
		var curNode;
		each(nms, function(nm, i){
			var nd = curNode?curNode.children[nm]:tree[nm];
			if(!nd){
				nd = {name:nm, children:{}};
				if(curNode){
					nd.parent = curNode;
					curNode.children[nd.name] = nd;
				}
				else{
					tree[nd.name] = nd;
				}
			}
			curNode = nd;
		});
		curNode.member = mmb;
	}

	
	function displayDoc(xdoc){
		var members = xdoc.getElementsByTagName("member");
		each(members, function(mmb){
			var mmbNm = mmb.getAttribute("name");
			var nms = mmbNm.split(":");
			var nm = nms[1], t = nms[0];
			var itm = {fullName:nm, type:t};
			var tags = getAttributes(mmb, itm);
			memberIndex[nm] = itm;
		});
		each(memberIndex, addTreeNode);
		
		
		$("#out").html(templates.table());
	}
	
	function getAttributes(mmb, itm){
		var tagNames = [];
		each(mmb.children, function(ch){
			switch(ch.tagName){
				case "tags":
					var tagsList = ch.childNodes[0].wholeText;
					tagNames.push(tagsList);
					indexTags(itm, tagsList);
					break;
				case "summary":
					itm.description = ch.childNodes[0].wholeText;
					break;
				default:break;
			}
		});
		if(tagNames.length) itm.tags = tagNames.join(";");
	}
	
	function indexTags(mmb, tagsList){
		var lst = tagsList.split(";");
		each(lst, function(t){
			if(!tags[t]) tags[t] = [];
			tags[t].push(mmb);
		});
	}
	
	var __ = {
		display: function(xmlDocFile){
			XmlDoc.load(xmlDocFile, function(xdoc){
				displayDoc(xdoc);
			});
		},
		displayMembers: function(tagName){
			$("#selectedMembersPnl").html(templates.selectedMembers(tagName));
		}
	};
	
	return __;
})();