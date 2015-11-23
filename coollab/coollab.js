var Coollab = (function($,$H){
	var roots, nodesByID, nodesByTrg, allNodes;
	var mainPanel;
	var changed = false;
	var docManager;

	
	function each(c, F){
		if(!c) return;
		if(c instanceof Array){
			if(!c.length) return;
			for(var i=0,e; e=c[i],i<c.length; i++) F(e,i);
		}
		else if(typeof(c)=="object"){
			for(var k in c) F(c[k], k);
		}
	}
	
	function select(c,F){
		if(!c) return;
		if(c instanceof Array){
			if(!c.length) return;
			for(var i=0,e; e=c[i],i<c.length; i++){
				if(F(e)) return e;
			}
		}
		else if(typeof(c)=="object"){
			for(var k in c){
				var e = c[k];
				if(F(e)) return e;
			}
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
	
	function indexDocs(){
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
		
		each(Coollab.Docs, function(d){
			each(d.roots, function(r){
				roots.push(r);
				indexNode(r, d, d);
			});
			each(d.nodes, function(nd){
				indexNode(nd, d, d);
			});
		});
		
	}
	
	
	function updateView(){
		indexDocs();
		var events = [];

		mainPanel.html((function(){with($H){
			return div({"class":"coollabWin"},
				changed?div(input({type:"button", value:"Сохранить изменения", "class":"btSaveChanges"})):null,
				div({"class":"pnlTree"},
					apply(roots, function(r){
						if(Coollab.Forms[r.type].view.events)events.push(function(pnl){
							Coollab.Forms[r.type].view.events(r, pnl);
						});
						return Coollab.Forms[r.type].view.template(r);
					})
				),
				div({"class":"pnlProp"})
			);
		}})())
		.find(".lnkEdit").click(function(){
			editNode(allNodes[$(this).attr("data-node")]);
		}).end()
		.find(".btSaveChanges").click(function(){
			docManager.save(serializeJSON(getUserDoc()), function(){
				alert("Изменения успешно сохранены");
				changed = false;
				updateView();
			})
		}).end();
		
		each(events, function(evt){
			if(evt) evt(mainPanel);
		});
	}
	
	function serializeJSON(obj){
		if(typeof(obj)=="function") return "";
		if(obj instanceof Array){
			var res = [];
			for(var i=0,el; el=obj[i],i<obj.length; i++){
				res.push(serializeJSON(el));
			}
			return "["+res.join(",")+"]";
		}
		if(typeof(obj)=="object"){
			var res = [];
			for(var k in obj){
				if(k=="_")continue;
				var el = obj[k];
				res.push("\""+k+"\":"+serializeJSON(el));
			}
			return "{"+res.join(",")+"}";
		}
		if(typeof(obj)=="string"){
			return "\""+obj.replace(/\"/ig, "\\\"")+"\""
		}
		return obj+"";
	}
	
	var DocManager = (function(){
		
		function localManager(){
			this.load = function(userID, callback){
				Coollab.Docs.push(LocalDocs[userID]);
				callback();
			};
			this.save = function(content, callback){
				var savedDoc = $.parseJSON(content);
				console.log("Saved document: ", savedDoc);
				callback();
			}
		}
		
		function phpManager(){
			this.load = function(userID, callback){
				var url = "docs/d"+userID+".txt";
				$.get(url, {}, function(res){res=$.parseJSON(res);
					Coollab.Docs.push(res);
					callback();
				});
			};
			this.save = function(content, callback){
				$.post("ws/savedoc.php", {doc:"dx"+Coollab.UserID+".txt", content:content}, function(res){res=$.parseJSON(res);
					if(res.error){alert(res.error); return;}
					callback();
				});
			}
		}
		
		return function(type){
			switch(type){
				case "local": return new localManager(); break;
				case "php": return new phpManager(); break;
				default: alert("Unknown DocManager type: '"+type+"'"); break;
			}
		};
	})();
	
	function init(pnl){
		docManager = DocManager(Coollab.docManagerType);
		mainPanel = pnl;
		pnl.html($H.img({src:"wait.gif"}));
		loadDocs(updateView);
	}
	
	function editNode(nd){
		Coollab.Forms[nd.type].editor(nd, $(".pnlProp"))
	}
	
	function loadDocs(callback){
		var semaphore = 0, counter = 0;
		
		each(Coollab.Users, function(uid){
			docManager.load(uid, function(){
				semaphore++;
			});
		});
		
		function wait(callback){
			if(counter>20){alert("Превышен таймаут загрузки документов."); return;}
			counter++;
			if(semaphore<Coollab.Users.length)setTimeout(function(){
				wait(callback);
			}, 500);
			else callback();
		}
		wait(callback);
	}
	
	function acceptChanges(){
		changed = true;
		updateView();
	}
	
	function closeEditor(){
		$(".pnlProp").html("");
	}
	
	function getUserDoc(uid){
		uid = uid || Coollab.UserID;
		return select(Coollab.Docs, function(d){
			return d.user.id==uid;
		});
	}
	
	function addNode(target, type){
		if(!target.id){alert("Добавление элемента не возможно"); return;}
		
		var newNode = {trg: target.id, type:"type"};
		Coollab.Forms[type].editor(newNode, $(".pnlProp"), function(){
			getUserDoc().nodes.push(newNode);
		});
	}
	
	$.fn.coollab = function(userID, users){
		Coollab.UserID = userID;
		Coollab.Users = users instanceof Array?users:typeof(users)=="string"?users.split(";"):null;
		$(this).each(function(i, el){
			init($(el));
		});
	};
		
	Coollab = {
		Docs: [],
		Templates:{},
		docManagerType: "php", // "local"
		collectNodes: collectNodes,
		acceptChanges: acceptChanges,
		closeEditor: closeEditor,
		addNode: addNode,
		getNode: function(id){return nodesByID[id];}
	};
	
	return Coollab;
})(jQuery, Html);