if(typeof(Html)=="undefined")
	alert("Module html.js required!");
if(typeof(DateExt)=="undefined")
	alert("Module dateExt.js required!");
	
var Diary = {
	version: "0.0.0"
};

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
	
	function find(coll, cond){
		for(var i=0; i<coll.length; i++){
			var el = coll[i];
			if(cond(el)) return el;
		}
		return null;
	}

	function $(id){return document.getElementById(id);}

	var _ = Diary;
	var taglist = {};
	var itemCounter = 0;
	var instances = [];
	var selectedTags = {};
	
	if(typeof(JSUnit)!="undefined"){
		_._ = {
			SleepGraph:SleepGraph
		};
	}
	
	extend(_, {
		diary: function(){var d = this;
			d.items = [];
			d.id = instances.length;
			instances.push(d);
			each(arguments, function(a, i){
				d.items.push(a);
			});
			d.sleepGraph = new SleepGraph(d);
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
		},
		
		toggleFilter: function(id){instances[id].toggleFilter();}
	});
	
	function capitalize(str){
		return str.substr(0, 1).toUpperCase()+str.substr(1);
	}

	
	var templates = {
		item: function(itm, instId){with(Html){
			return div(
				itm.year?templates.year(itm, instId)
				:itm.month?templates.month(itm, instId)
				:itm.day?templates.day(itm, instId)
				:itm.dsc?templates.dsc(itm, instId)
				:null
			);
		}},
		
		year: function(item, instId){with(Html){
			return div(
				div(
					apply(item.items, function t(itm){return templates.month(itm, instId)})
				)
			);
		}},
		month: function(item, instId){with(Html){
			return div(
				div(
					apply(item.items, function t(itm){return templates.day(itm, instId)})
				)
			);
		}},
		day: function(item, instId){with(Html){
			function selectedItemsFound(){
				var res = false;
				each(item.items, function(itm){
					if(itm.tags){
						var tags = itm.tags.split(";");
						each(tags, function(tag){
							if(selectedTags[tag]) res = true;
						});
					}
				});
				return res;
			}
			
			if(instances[instId].filter && !selectedItemsFound())
				return null;
				
			var onMarker = find(item.items, function(el){return el.on!=null;});
			var offMarker = find(item.items, function(el){return el.off!=null;});
			var sleepGraphItem = instances[instId].sleepGraph.getDay(item.parent.parent.year, item.parent.month, item.day);
				
			var date = new Date(item.parent.parent.year, item.parent.month - 1, item.day);
			return div(
				hr(),
				p({style:"font-weight:bold;"}, capitalize(DateExt.format.local.toString(date))),
				onMarker?p(
					"Подъем: ", onMarker.on, 
					sleepGraphItem&&sleepGraphItem.sleeping?span(", сна ", sleepGraphItem.sleeping.h, ":", sleepGraphItem.sleeping.m):null,
					onMarker.state?span(", state:", onMarker.state):null
				):null,
				div(
					apply(item.items, function t(itm){return templates.item(itm, instId)})
				),
				offMarker?p("Отбой: ", offMarker.off):null
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
			if(instances[id].filter && !itemSelected) return null;
			return p(
				itemSelected?{style:"background-color:#ffff00;"}:null,
				item.time? span(span({style:"color:#0000ff;"}, item.time), " "): null,
				item.tags? span(span({style:"background-color:#eeeeee;"}, item.tags), " "): null,
				item.dsc
			);
		}}
	};
	
	extend(_.diary.prototype, {
		id:0,
		pnlId:null,
		filter:false,

		toggleFilter: function(){var inst=this;
			inst.filter = $("cbFilter"+inst.id).checked;
			inst.display();
		},

		display: function(pnlId){var inst=this;
			if(pnlId)
				this.pnlId = pnlId;
			else
				pnlId = this.pnlId;
			var html = [];
			with(Html){
				var cbFilterAttr = {type:"checkbox", id:"cbFilter"+inst.id, onclick:callFunction("Diary.toggleFilter", inst.id)};
				if(inst.filter) cbFilterAttr.checked = true;
				html.push(
					div(
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
					),
					p(
						input(cbFilterAttr),
						label({for:"cbFilter"+inst.id}, "filter")
					)
				);
			}
			each(this.items, function(itm){
				html.push(templates.item(itm, inst.id));
			});
			$(pnlId).innerHTML = html.join("");
		}
	});
	
	function SleepGraph(diary){var _=this;
		_.diary = diary;
		_.days = _.getDaysSequence();
		_.detectGaps(_.days);
	}
	
	SleepGraph.prototype = {
		getDay: function(y, m, d){
			return find(this.days, function(day){return day.year==y && day.month==m && day.day==d;});
		},
		
		getDaysSequence: function(){var _=this;
			var days = [];
			
			function addDays(srcEl, trgColl, context){
				context = context||{};
				if(srcEl.year) context.year = srcEl.year;
				if(srcEl.month) context.month = srcEl.month;
				if(srcEl.day){
					var data = {year:context.year, month: context.month, day:srcEl.day};
					var onMarker = find(srcEl.items, function(e){return e.on});
					var offMarker = find(srcEl.items, function(e){return e.off});
					if(onMarker) extend(data, {on:onMarker.on, state:onMarker.state});
					if(offMarker) extend(data, {off:offMarker.off});
					
					trgColl.push(data);
				}
				if(srcEl.items){
					for(var i=0; i<srcEl.items.length; i++){
						addDays(srcEl.items[i], trgColl, context);
					}
				}
			}
			addDays(_.diary, days);
			days.sort(function(d1, d2){
				var t1 = d1.year*10000+d1.month*100+d1.day;
				var t2 = d2.year*10000+d2.month*100+d2.day;
				return t1-t2;
			});
			return days;
		},
		
		detectGaps: function(days){var _=this;
			var wholeDay = 60*60*24*1000;
			for(var i=0; i<days.length; i++){
				var day = days[i];
				if(i==0) day.gap = true;
				else{
					var prev = days[i-1];
					var D = new Date(day.year, day.month-1, day.day);
					var prevD = new Date(prev.year, prev.month-1, prev.day);
					var dt = D.getTime() - prevD.getTime();
					if(dt>wholeDay) day.gap = true;
					else _.calcInterval(day, prev);
				}
			}
		},
		
		calcInterval: function(day, prev){
			function parse(t){
				var mt = t.match(/^0?(\d+)[:\.]0?(\d+)$/i);
				return {h:parseInt(mt[1]), m:parseInt(mt[2])};
			}
			var dOff = prev.off;
			var dOn = day.on;
			if(!(dOn && dOff)) return;
			dOff = parse(dOff); 
			dOn = parse(dOn);
			if(dOff.h>13){
				dOn.h = dOn.h +(24 - dOff.h);
				dOff.h = 0;
			}
			var d1 = dOff.h*60 + dOff.m;
			var d2 = dOn.h*60 + dOn.m;
			var dt = d2 - d1;
			day.sleeping = {h:Math.floor(dt/60), m:dt%60};
		}
	}
})();
 
