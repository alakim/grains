var Coollab = (function($,$H){
	var roots, nodesByID, nodesByTrg, allNodes;
	var mainPanel;
	var changed = {};
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
	
	function selectItems(c,F){
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
	
	function collectNodes(nd, type){
		var nodes = [];
		each(nd.nodes, function(n){
			if(!type || type==n.type)
				nodes.push(n);
		});
		each(nodesByTrg[nd._.dataSetID][nd.id], function(n){
			if(!type || type==n.type)
				nodes.push(n);
		});
		return nodes;
	}
	
	var generateID = (function(){
		var counters = [];
		return function(dataSetID, userID){
			if(!counters[userID]) counters[userID] = 1;
			for(; nodesByID[dataSetID][userID+"."+counters[userID]]; counters[userID]++){}
			return counters[userID];
		};
	})();
	
	function indexDocs(dataSetID, resetIndexes){
		if(resetIndexes){
			roots = [];
			nodesByID = {};
			nodesByTrg = {};
			allNodes = [];
		}

		
		roots[dataSetID] = [];
		nodesByID[dataSetID] = {};
		nodesByTrg[dataSetID] = {};
		allNodes[dataSetID] = [];
		
		function indexNode(nd, parent, doc){
			if(typeof(nd)!="object") return;
			nd._ = {
				parent: parent,
				doc: doc,
				idx: allNodes[dataSetID].length,
				dataSetID:dataSetID
			};
			allNodes[dataSetID].push(nd);
			if(nd.id) nodesByID[dataSetID][nd.id] = nd;
			if(nd.trg){
				if(!nodesByTrg[dataSetID][nd.trg]) nodesByTrg[dataSetID][nd.trg] = [];
				nodesByTrg[dataSetID][nd.trg].push(nd);
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
		
		each(Coollab.Docs[dataSetID], function(d){
			if(!d) return;
			each(d.roots, function(r){
				roots[dataSetID].push(r);
				indexNode(r, d, d);
			});
			each(d.nodes, function(nd){
				indexNode(nd, d, d);
			});
		});
		
	}
	
	
	function updateView(dataSetID, pnl){
		if(!dataSetID) alert("Unknown DataSet '"+dataSetID+"'");
		pnl = pnl || mainPanel;
		var events = [];

		pnl.html((function(){with($H){
			return div({"class":"coollabWin"},
				changed[dataSetID]?div(input({type:"button", value:"Сохранить изменения", "class":"btSaveChanges"})):null,
				div({"class":"pnlTree"},
					apply(roots[dataSetID], function(r){
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
			editNode(allNodes[dataSetID][$(this).attr("data-node")], pnl);
		}).end()
		.find(".btSaveChanges").click(function(){
			docManager.save(dataSetID, serializeJSON(getUserDoc(dataSetID)), function(){
				alert("Изменения успешно сохранены");
				changed[dataSetID] = false;
				updateView(dataSetID, pnl);
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
			this.load = function(dataSetID, userID, callback){
				Coollab.Docs[dataSetID].push(LocalDocs[dataSetID][userID]);
				callback();
			};
			this.save = function(dataSetID, content, callback){
				var savedDoc = $.parseJSON(content);
				console.log("Saved document: ", dataSetID, "/ ", savedDoc);
				callback();
			}
		}
		
		function phpManager(){
			this.load = function(dataSetID, userID, callback){
				var url = dataSetID+"/d"+userID+".txt";
				$.get(url, {}, function(res){res=$.parseJSON(res);
					Coollab.Docs[dataSetID].push(res);
					callback();
				});
			};
			this.save = function(dataSetID, content, callback){
				$.post("ws/savedoc.php", {doc:dataSetID+"/dx"+Coollab.UserID+".txt", content:content}, function(res){res=$.parseJSON(res);
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
		loadDocs(Coollab.rootDataSetID, function(){
			indexDocs(Coollab.rootDataSetID, true);
			updateView(Coollab.rootDataSetID, pnl);
		});
	}
	
	function editNode(nd, pnl){
		Coollab.Forms[nd.type].editor(nd, pnl.find(".pnlProp"))
	}
	
	function loadDocs(dataSetID, callback){
		var semaphore = 0, counter = 0;
		Coollab.Docs[dataSetID] = [];
		
		each(Coollab.Users, function(uid){
			docManager.load(dataSetID, uid, function(){
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
	
	function acceptChanges(dataSetID, pnl){
		changed[dataSetID] = true;
		updateView(dataSetID, pnl.parent());
	}
	
	function closeEditor(){
		$(".pnlProp").html("");
	}
	
	function getUserDoc(dataSetID, uid){
		uid = uid || Coollab.UserID;
		return selectItems(Coollab.Docs[dataSetID], function(d){
			return d.user.id==uid;
		});
	}
	
	function ownerMode(el){
		return el._.doc.user.id==Coollab.UserID;
	}
	
	function addNode(target, type, sealed){
		var newNode = {type:type};

		if(!ownerMode(target)){
			if(!target.id){alert("Добавление элемента не возможно"); return;}
			newNode.trg = target.id;
		}
		newNode._ = {
			parent: target,
			doc: getUserDoc(target._.dataSetID),
			idx: allNodes[target._.dataSetID].length,
			dataSetID:target._.dataSetID
		};
		Coollab.Forms[type].editor(newNode, $(".pnlProp"), function(){
			if(ownerMode(target)){
				if(!target.nodes) target.nodes = [];
				target.nodes.push(newNode);
			}
			else
				getUserDoc(target._.dataSetID).nodes.push(newNode);

			allNodes[target._.dataSetID].push(newNode);
			
			if(!sealed){
				newNode.id = generateID(target._.dataSetID, Coollab.UserID);
			}
			// roots = [];
			
			if(newNode.trg){
				if(!nodesByTrg[target._.dataSetID][newNode.trg]) nodesByTrg[target._.dataSetID][newNode.trg] = [];
				nodesByTrg[target._.dataSetID][newNode.trg].push(newNode);
			}

			
			if(newNode.id) nodesByID[target._.dataSetID][newNode.id] = newNode;
		});
	}
	
	function loadDataSet(dataSetID, pnl){
		loadDocs(dataSetID, function(){
			indexDocs(dataSetID, false);
			changed[dataSetID] = false;
			updateView(dataSetID, pnl);
		});
	}
	
	$.fn.coollab = function(userID, users, rootDataSetID){
		Coollab.UserID = userID;
		Coollab.Users = users instanceof Array?users:typeof(users)=="string"?users.split(";"):null;
		Coollab.rootDataSetID = rootDataSetID;
		$(this).each(function(i, el){
			init($(el));
		});
	};
		
	Coollab = {
		Docs: [],
		Forms:{},
		docManagerType: "php", // "local"
		collectNodes: collectNodes,
		acceptChanges: acceptChanges,
		closeEditor: closeEditor,
		loadDataSet: loadDataSet,
		addNode: addNode,
		selectItems: selectItems,
		ownerMode:ownerMode,
		getNode: function(dataSetID, id){return nodesByID[dataSetID][id];}
	};
	
	return Coollab;
})(jQuery, Html);