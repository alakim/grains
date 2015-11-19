var Coollab = (function($,$H){
	var roots, nodesByID, nodesByTrg, allNodes;

	
	function each(c, F){
		if(!c) return;
		if(c instanceof Array){
			if(!c.length) return;
			for(var i=0,e; e=c[i],i<c.length; i++) F(e,i);
		}
	}
	
	function collectNodes(nd){
		var nodes = [];
		each(nd.nodes, function(n){
			nodes.push(n);
		});
		each(nodesByTrg[nd.id], function(n){
			nodes.push(n);
		});
		return nodes;
	}
	
	var generateID = (function(){
		var counters = [];
		return function(userID){
			if(!counters[userID]) counters[userID] = 1;
			for(; nodesByID[userID+"."+counters[userID]]; counters[userID]++){}
			return counters[userID];
		};
	})();
	
	function indexDocs(docs){
		roots = [];
		nodesByID = {};
		nodesByTrg = {};
		allNodes = [];
		
		function indexNode(nd, parent, doc){
			if(typeof(nd)!="object") return;
			nd._ = {
				parent: parent,
				doc: doc,
				idx: allNodes.length
			};
			allNodes.push(nd);
			if(nd.id) nodesByID[nd.id] = nd;
			if(nd.trg){
				if(!nodesByTrg[nd.trg]) nodesByTrg[nd.trg] = [];
				nodesByTrg[nd.trg].push(nd);
			}
			for(var k in nd){
				if(k=="_") continue;
				var sub = nd[k];
				if(sub instanceof Array){
					each(sub, function(s){
						indexNode(s, nd, doc);
					});
				}
				else if(typeof(sub)=="object")
					indexNode(sub, nd, doc);
			}
		}
		
		each(docs, function(d){
			each(d.roots, function(r){
				roots.push(r);
				indexNode(r, d, d);
			});
			each(d.nodes, function(nd){
				indexNode(nd, d, d);
			});
		});
		
	}
	
	function init(pnl, docs){
		indexDocs(docs);
		//console.log(nodesByTrg);
		//console.log(generateID(1));
		//console.log(generateID(2));
		//console.log(generateID(3));

		pnl.html((function(){with($H){
			return div(
				apply(roots, function(r){
					return Coollab.Templates[r.type](r);
				})
			);
		}})())
		.find(".lnkEdit").click(function(){
			var nodeIdx = $(this).attr("data-node");
			alert("Edit node#"+ nodeIdx);
			console.log(allNodes[nodeIdx]);
		}).end();
	}
	
	$.fn.coollab = function(userID){
		Coollab.UserID = userID;
		$(this).each(function(i, el){
			init($(el), Coollab.Docs);
		});
	};
		
	Coollab = {
		Docs: [],
		Templates:{},
		collectNodes: collectNodes
	};
	
	return Coollab;
})(jQuery, Html);