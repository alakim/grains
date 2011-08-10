if(typeof(Html)!="object") alert("html.js module required!");

var Decisions = (function(){
	var version = "2.6.384";
	
	function each(coll, F){
		if(coll instanceof Array) for(var i=0; i<coll.length; i++)F(coll[i], i);
		else for(var k in coll)F(coll[k], k);
	}
	
	function addEventHandler(trgEl, eventNm, handler){
		var eventNm=(window.addEventListener)? eventNm : "on"+eventNm;
		if (trgEl.addEventListener)
			trgEl.addEventListener(eventNm, handler, false);
		else if (trgEl.attachEvent)
			trgEl.attachEvent(eventNm, handler);
	}
	
	var items = {};
	var roots = [];
	function register(itm){
		itm.id = itm.id || Uid.getNew();
		items[itm.id] = itm;
		if(itm.type=="Reasoning") roots.push(itm);
	}
	
	var tagIndex = {};
	function buildTagIndex(){
		each(items, function(itm, id){
			if(!itm.tags) return;
			if(!(itm.tags instanceof Array)) itm.tags = itm.tags.split(";");
			each(itm.tags, function(t){
				var indexList = tagIndex[t];
				if(!indexList){
					indexList = [];
					tagIndex[t] = indexList;
				}
				indexList.push(itm);
			});
		});
	}
	
	function buildChildren(item, args, argIdx){
		item.children = [];
		for(var i=argIdx; i<args.length; i++){var v = args[i];
			if(v.type=="ID") item.id = v.name;
			else if(v.type=="Rating") item.rating = v.value;
			else if(v.type=="Tags") item.tags = v.value;
			else if(v.type=="SolutionRating"){
				if(item.type!="Criterion") throw "SolutionRating item applicable only to Criterion item.";
				if(!item.ratings) item.ratings = {};
				item.ratings[v.solutionID] = v;
			}
			else if(v.type=="Criterion"){
				if(!item.criteria) item.criteria = [];
				item.criteria.push(v);
				
				if(typeof(v)=="object")v.parent = item;
				item.children.push(v)
			}
			else{
				if(typeof(v)=="object")
					v.parent = item;
				item.children.push(v);
			}
		}
	}
	
	var Uid = (function(){
		var counter = 0;
		return {
			getNew: function(){
				return "uid"+(counter++);
			},
			isUid: function(id){
				return typeof(id)=="string" && id.match(/^uid\d+$/)!=null;
			}
		};
	})();
	
	var templates = {
		footer: function(){with(Html){
			return div({"class":"footer"},
				"Powered by. ",
				"Decisions v.", __.version, ", ",
				"Html.js v.", Html.version
			);
		}},
		taggedItems:function(t){with(Html){
			console.log(2, t);
			return div(
				console.log(tagIndex, t),
				apply(tagIndex[t], function(itm, i){
					return span(
						a({href:"#"+itm.id}, itm.name),
						" "
					);
				})
			);
		}},
		tags: function(){with(Html){
			return div({"class":"tagsPanel"},
				span({style:"font-weight:bold;"}, "Tags: "),
				apply(tagIndex, function(items, tag){
					return span(
						span({
							style:"cursor:hand;cursor:pointer;",
							color:"#000088",
							onclick:callFunction("Decisions.UI.showItems", tag)
						}, tag),
						" "
					);
				}),
				div({id:"taggedItemsPanel"})
			);
		}},
		advantage: function (title, className){ //advantageTemplate
			return function(){with(Html){var _=this;
				return div(
					div(
						span({"class":className}, title+": "),
						_.children.length==1?(function(){
							var c1 = _.children[0];
							return typeof(c1.html)=="function"?c1.html():c1;
						})():null
					),
					_.children.length>1?div({style:"margin-left:15px;"},
						apply(_.children, function(c, i){
							return div(typeof(c.html)=="function"?c.html():c);
						})
					):null
				);
			}};
		}
	};
	
	function display(pnlID){
		buildTagIndex();
		var html = [];
		html.push(templates.tags());
		each(roots, function(r){html.push(r.html());});
		document.body.innerHTML = html.join(" ")+templates.footer();
	}
	
	var __ = {
		version:version,
		Language:{
			Reasoning: function(name){
				var _ = {
					type:"Reasoning",
					name:name,
					html: function(){with(Html){
						return div(
							h1(this.name),
							apply(this.children, function(c){
								return div({style:"margin-left:20px;"},
									c.html()
								);
							})
						);
					}}
				};
				
				buildChildren(_, arguments, 1);
				register(_);
				return _;
			},
			Problem: function(name){
				var itm ={
					type:"Problem",
					name:name,
					html: function(){with(Html){var _=this;
						function criteriaNorm(){
							if(!_.criteria) return;
							var norm = 0;
							each(_.criteria, function(cr){norm+=cr.rating;});
							if(norm!=100) return Html.span({style:"backgroundColor:yellow; color:red;"},
								"Ошибка нормировки. Сумма рейтингов критериев: ", norm, ", норма: 100."
							);
						}
						
						return tagCollection(
							h1(
								{"class":"problem", id:"hdr"+_.id,
									onclick:callFunction("Decisions.UI.toggle", _.id),
									title:"Развернуть"
								},
								a({name:_.id},
									"Задача: ", _.name,
									Uid.isUid(_.id)?null:tagCollection(
										"<a name=\"", _.id,"\"></a>",
										span({style:"color:#aaaaee;"}, " [", _.id, "]")
									)
								)
							),
							criteriaNorm(),
							div({"class":"section", id:"div"+_.id, style:"display:none;"},
								apply(_.children, function(c){with(Html){
									return typeof(c.html)=="function"?c.html():c;
								}}),
								_.criteria?div({
									style:"color:#000088; text-decoration:underline; cursor:hand;cursor:pointer",
									onclick:callFunction("Decisions.UI.toggleCriteria", _.id)
								}, "таблица критериев"):null
							)
						);
					}}
				};
				buildChildren(itm, arguments, 1);
				register(itm);
				return itm;
			},
			Description: function(){
				var _={
					html: function(){with(Html){
						return div({style:"font-style:italic;"},
							apply(this.children, function(c){
								return typeof(c.html)=="function"?c.html():c;
							})
						);
					}}
				};
				buildChildren(_, arguments, 0);
				return _;
			},
			Criterion: function(name){
				var _={
					type:"Criterion",
					name: name,
					problemID:function(){var _=this;
						if(_.parent.type!="Problem") throw "Criterion parent must be Problem";
						return _.parent.id;
					},
					html: function(){with(Html){var _=this;
						var solutionsNorm = 0;
						each(_.ratings, function(r){solutionsNorm+=r.value;});
						return div({"class":"transparent", style:"display:none;", problemId:_.problemID()},
							h2(
								a({name:_.id}, "Критерий:&#160;", _.name,
									span({
										style:"cursor:default;", 
										titile:"Рейтинг (важность) критерия"
									}, "(",_.rating,")")
								)
							),
							solutionsNorm!=100?div({style:"backgroundColor:yellow; color:red;"},
								"Ошибка нормировки. Сумма рейтингов решений: ", solutionsNorm, " (норма: 100)."
							):null,
							div({"class":"section"},
								apply(_.ratings, function(sr, solID){
									return div(
										sr.value, "&#160;", items[solID].name, ": ",
										span({style:"font-style:italic;"}, sr.comment)
									);
								})
							)
						)
					}}
				};
				buildChildren(_, arguments, 1);
				return _;
			},
			Rating: function(val){var _=this;
				return {type:"Rating", value:val};
			},
			Tags:function(val){var _=this;
				return {type:"Tags", value:val};
			},
			SolutionRating: function(solutionID, val, comment){var _=this;
				return {
					type:"SolutionRating",
					solutionID:solutionID,
					comment:comment,
					value:val,
					html: function(){with(Html){
						return div(
							"Solution Rating ", val,
							span(comment)
						);
					}}
				};
			},
			Solution:function(name){
				var _={
					type:"Solution",
					name:name,
					html: function(){with(Html){
						function criteriaTable(){with(Html){
							var sum = 0;
							return _.parent.criteria?div({style:"margin-top:10px;"},
								span({style:"font-weight:bold;"}, "Оценки:&#160;"),
								apply(_.parent.criteria, function(cr){
									var rating = cr.ratings[_.id];
									if(rating){
										sum+=rating.value*cr.rating;
										return Html.a(cr.name, ":", rating.value, "&#160;");
									}
								}),
								" ",
								span("Итого: ", sum)
							):null;
						}}

						return tagCollection(
							h2({"class":"solution"},
								a({"name":_.id}, "Решение: ", _.name,
									_.date?span(" - ",_.date):null,
									Uid.isUid(_.id)?null:tagCollection(
										"<a name=\"", _.id, "\"></a>",
										span({style:"color:#aaaaee;"}, " [", _.id, "]")
									)
								)
							),
							div({"class":"section"},
								apply(_.children, function(c){
									return typeof(c.html)=="function"?c.html():c;
								}),
								criteriaTable()
							)
						);
					}}
				};
				buildChildren(_, arguments, 1);
				register(_);
				return _;
			},
			ID:function (name){var _=this;
				return {type:"ID", name:name};
			},
			Conclusion: function(){
				var _={
					html: function(){with(Html){
						return tagCollection(
							h2("Заключение"),
							div({"class":"section"},
								apply(this.children, function(c){
									return typeof(c.html)=="function"?c.html():c;
								})
							)
						);
					}}
				};
				buildChildren(_, arguments, 0);
				return _;
			},
			Ref: function(refID){
				var _={
					refID: refID,
					html: function(){with(Html){
						return a({href:"#"+refID},
							refID
						);
					}}
				};
				buildChildren(_, arguments, 1);
				return _;
			},
			Contra: function(){
				var _={
					html: function(){with(Html){
						return span({"class":"contra"},
							span({style:"font-weight:bold;"}, "contra: "),
							apply(this.children, function(c){
								return typeof(c.html)=="function"?c.html():c;
							})
						);
					}}
				};
				buildChildren(_, arguments, 0);
				return _;
			},
			p:function(){
				var _={
					html: function(){with(Html){
						return div(
							apply(this.children, function(c){
								return typeof(c.html)=="function"?c.html():c;
							})
						);
					}}
				};
				buildChildren(_, arguments, 0);
				return _;
			},
			Advantage: function(){var _=this;
				var _={
					type:"Advantage",
					html: templates.advantage("Преимущество", "advantage")
				};
				buildChildren(_, arguments, 0);
				register(_);
				return _;
			},
			Disadvantage: function(){var _=this;
				var _={
					type:"Disadvantage",
					html: templates.advantage("Недостаток", "disadvantage")
				};
				buildChildren(_, arguments, 0);
				register(_);
				return _;
			}
		},
		UI: {
			highlight:function(ref){
				var arr = document.getElementsByTagName("A");
				for(var i=0; i<arr.length; i++){
					var el = arr[i];
					el.style.backgroundColor = el.name==ref?"yellow":"white";
				}
			},
			toggleCriteria: function(problemId){
				var a = document.getElementsByTagName("DIV");
				for(var i=0; i<a.length; i++){
					var el = a[i];
					if(el.attributes.problemId&&el.attributes.problemId.value==problemId){
						el.style.display = el.style.display!="none"?"none":"block";
					}
				}
			},
			toggle: function(id){
				var div = document.getElementById("div"+id);
				var hdr = document.getElementById("hdr"+id);
				var collapse = div.style.display!="none";
				div.style.display  = collapse?"none":"block";
				hdr.title = collapse?"Развернуть":"Свернуть";
			},
			showItems: function(tag){
				var div = document.getElementById("taggedItemsPanel");
				console.log(1, tag);
				div.innerHTML = templates.taggedItems(tag);
			}
		}
	};

	if(typeof(JDoc)=="object"){__.internals = {
		each:each, 
		addEventHandler: addEventHandler,
		items:items,
		roots:roots,
		tagIndex: tagIndex,
		display: display, 
		templates: templates,
		Uid: Uid,
		buildChildren: buildChildren,
		buildTagIndex: buildTagIndex,
		register: register
	};}
	else{
		addEventHandler(window, "load", function(){
			if(!document.title.length){
				document.title = roots[0].name;
			}
			display();
		});
	}
	


	return __;
})();

