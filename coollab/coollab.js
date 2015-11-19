var Coollab = (function($,$H){
	var roots, nodesByID, nodesByTrg;

	
	function each(c, F){
		if(!c) return;
		if(c instanceof Array){
			if(!c.length) return;
			for(var i=0,e; e=c[i],i<c.length; i++) F(e,i);
		}
	}
	
	var templates = {
		calendar: function(cal){with($H){
			var events = collectNodes(cal);
			return div(
				h3("Календарь"),
				p("Создал User#",cal._doc.user.id, ", ",cal._doc.user.name),
				p("События"),
				ul(
					apply(events, function(evt){
						return li(templates.event(evt))
					})
				)
			);
		}},
		event: function(evt){with($H){
			var members = collectNodes(evt);
			return markup(
				evt.date, ": ", evt.name,
				div(
					"Участники (", members.length, "): ",
					ol(
						apply(members, function(m){
							return li("User#", m._doc.user.id, ", ", m._doc.user.name, " ", m.value?"+":"-");
						})
					)
				)
			);
		}}
	};
	
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
	
	function indexDocs(docs){
		roots = [];
		nodesByID = {};
		nodesByTrg = {}
		
		function indexNode(nd, parent, doc){
			if(typeof(nd)!="object") return;
			nd._parent = parent;
			nd._doc = doc;
			if(nd.id) nodesByID[nd.id] = nd;
			if(nd.trg){
				if(!nodesByTrg[nd.trg]) nodesByTrg[nd.trg] = [];
				nodesByTrg[nd.trg].push(nd);
			}
			for(var k in nd){
				if(k=="_parent" || k=="_doc") continue;
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
		pnl.html((function(){with($H){
			return div(
				apply(roots, function(r){
					return Coollab.Templates[r.type](r);
				})
			);
		}})());
	}
	
	$.fn.coollab = function(){
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