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
		// namesList: function(){with(Html){
			// return div(
				// table(
					// apply(memberIndex, function(mmb, nm){
						// return tr(
							// td(mmb.type),
							// td(mmb.fullName)
						// );
					// })
				// )
			// );
		// }},
		table: function(){with(Html){
			// console.log(tree);
			return div(
				// templates.namesList(),
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
				nd.member?span({"class":"member"}, templates.type(nd.member.type), " ", nd.name)
					:span({"class":"module"}, nd.name),
				ul(
					apply(nd.children, templates.item)
				)
			);
		}}
	};
	
	var memberIndex = {};
	var entities = {};
	var tree = {};
	
	function addTreeNode(mmb){
		var nms = mmb.fullName.replace(/\([^\)]*\)/, "").split(".");
		var curNode;
		each(nms, function(nm, i){
			var nd = curNode?curNode.children[nm]:tree[nm];
			if(!nd){
				nd = {name:nm, children:{}};
				// if(i==nms.length-1)
					// nd.member = mmb;
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
		// console.log(xdoc.selectNodes("//member").length);
		// traceDoc(xdoc);
		var members = xdoc.getElementsByTagName("member");
		each(members, function(mmb){
			var mmbNm = mmb.getAttribute("name");
			var nms = mmbNm.split(":");
			var nm = nms[1], t = nms[0];
			memberIndex[nm] = {fullName:nm, type:t};
		});
		each(memberIndex, addTreeNode);
		
		
		$("#out").html(templates.table());
	}
	
	var __ = {
		display: function(xmlDocFile){
			XmlDoc.load(xmlDocFile, function(xdoc){
				displayDoc(xdoc);
			});
		}
	};
	
	return __;
})();