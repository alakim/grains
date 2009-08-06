if(typeof(Html)=="undefined")
	alert("Module html.js required!");
if(typeof(DateExt)=="undefined")
	alert("Module dateExt.js required!");
	
var Diary = {};

(function(){

	function extend(o, s){for(var k in s){o[k]=s[k];}}
	function each(coll, F){
		if(typeof(coll.length)!="undefined"){
			for(var i=0; i<coll.length; i++){
				F(coll[i], i);
			}
		}
		else{
			for(var k in coll){
				F(coll[k], k);
			}
		}
	}

	function $(id){return document.getElementById(id);}

	var _ = Diary;
	var taglist = {};
	var itemCounter = 0;
	var instances = [];
	var selectedTags = {};
	
	extend(_, {
		diary: function(){var d = this;
			d.items = [];
			d.id = instances.length;
			instances.push(d);
			each(arguments, function(a, i){
				d.items.push(a);
			});
		},
		
		selectTag: function(id, tagName){
			selectedTags[tagName] = selectedTags[tagName]?false:true;
			instances[id].display();
		},

		year: function(nr){
			var y = {year:nr, items:[]};
			each(arguments, function(a, i){
				a.parent = y;
				if(i>0) y.items.push(a);
			});
			return y;
		},

		month: function(nr){
			var m = {month:nr, items:[]};
			each(arguments, function(a, i){
				a.parent = m;
				if(i>0) m.items.push(a);
			});
			return m;
		},

		day: function(nr){
			var d = {day:nr, items:[]};
			each(arguments, function(a, i){
				if(i>0){
					d.items.push(a);
					a.id = "i"+itemCounter++;
					if(a.tags){
						var tags = a.tags.split(";");
						each(tags, function(t){
							if(!taglist[t])
								taglist[t] = [];
							taglist[t].push(a.id);
						});
					}
				}
			});
			return d;
		}
	});
	
	function capitalize(str){
		return str.substr(0, 1).toUpperCase()+str.substr(1);
	}

	
	var templates = {
		item: function(itm, instId){with(Html){
			return div(
				itm.year?templates.year(itm)
				:itm.month?templates.month(itm)
				:itm.day?templates.day(itm)
				:itm.dsc?templates.dsc(itm, instId)
				:null
			);
		}},
		
		year: function(item){with(Html){
			return div(
				div(
					apply(item.items, templates.month)
				)
			);
		}},
		month: function(item){with(Html){
			return div(
				div(
					apply(item.items, templates.day)
				)
			);
		}},
		day: function(item){
			var date = new Date(item.parent.parent.year, item.parent.month - 1, item.day);
			with(Html){
			return div(
				hr(),
				p({style:"font-weight:bold;"}, capitalize(DateExt.format.local.toString(date))),
				div(
					apply(item.items, templates.item)
				)
			);
		}},
		dsc: function(item, id){with(Html){
			var itemSelected = false;
			if(item.tags){
				var tags = item.tags.split(";");
				each(tags, function(tag){
					if(selectedTags[tag])
						itemSelected = true;
				});
			}
			return p(
				itemSelected?{style:"background-color:#ffff00;"}:null,
				item.time? span(span({style:"color:#0000ff;"}, item.time), " "): null,
				item.tags? span(span({style:"background-color:#eeeeee;"}, item.tags), " "): null,
				item.dsc
			);
		}},
	};
	
	extend(_.diary.prototype, {
		id:0,
		pnlId:null,
		display: function(pnlId){var inst=this;
			if(pnlId)
				this.pnlId = pnlId;
			else
				pnlId = this.pnlId;
			var html = [];
			with(Html){
				html.push(div(
					"Tags: ",
					apply(taglist, function(t, k){
						return span(span(
							{
								style:"color:#"+(selectedTags[k]?"ff0000":"0000ff")+"; text-decoration:underline; cursor:hand; cursor:pointer;",
								onclick:"Diary.selectTag("+inst.id+", '"+k+"')"
							},
							k
						),  ":", t.length, ", ");
					})
				));
			}
			each(this.items, function(itm){
				html.push(templates.item(itm, inst.id));
			});
			$(pnlId).innerHTML = html.join("");
		}
	});
})();
 
