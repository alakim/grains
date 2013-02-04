(function($){
	$.fn.gantt = function(options, data){
		options = $.extend({
			rowHeight: 20,
			fontSize: 12,
			headHeight: 35,
			taskLevelOffset: 15,
			grid:{color:"#ccc", draw:false},
			task:{color:"#88f", progressColor:"#aca"},
			complexTask:{color:"#888"},
			link:{color:"#008"},
		}, options);
		
		var taskIndex = {};
		var dateRange = {min:new Date(2200,0,1), max:new Date(1900, 0,1)};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = t;
			t.actualStart = parseDate(t.actualStart);
			t.actualEnd = parseDate(t.actualEnd);
			if(t.actualStart<dateRange.min) dateRange.min = t.actualStart;
			if(t.actualEnd>dateRange.max) dateRange.max = t.actualEnd;
		});
		dateRange.getDays = function(d1, d2){
			return (d2-d1)/(1000*60*60*24);
		};
		dateRange.days = dateRange.getDays(dateRange.min, dateRange.max);
		
		function taskLevel(id){
			var tDef = taskIndex[id];
			if(tDef.level!=null) return tDef.level;
			if(tDef.parent){
				tDef.level = taskLevel(tDef.parent)+1;
				if(taskIndex[tDef.parent].children==null)
					taskIndex[tDef.parent].children = [];
				taskIndex[tDef.parent].children.push(id);
			}
			else
				tDef.level = 0;
			return tDef.level;
		}
		
		function parseDate(sDate){
			var a = sDate.split(" ");
			var sDt = a[0];
			var b = sDt.split(".");
			var y = parseInt(b[0]),
				m = parseInt(b[1]),
				d = parseInt(b[2]);
			var res = new Date(y, m-1, d);
			if(a.length>1){
				var sT = a[1];
				var b = sT.split(".");
				res.setHours(parseInt(b[0]));
				res.setMinutes(parseInt(b[1]));
			}
			return res;
		}
		
		function formatMonth(date){
			return [
				"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
			][date.getMonth()];
		}
		
		function dateString(dt){
			var d = dt.getDate(),
				m = dt.getMonth()+1,
				y = dt.getYear()+1900;
			if(d<10) d = "0"+d;
			if(m<10) m = "0"+m;
			return [d,m,y].join(".");
		}
		
		function draw(container, data){

			var width = container.width(),
				height = container.height();
			var columns = [
				{w:25, fld:"id", title:"№"},
				{w:125, fld:"name", title:"Наименование", mrgLeft:5},
				{w:65, fld:"actualStart", title:"Вр.нач.", mrgLeft:5, f:dateString},
				{w:65, fld:"actualEnd", title:"Вр.кон.", mrgLeft:5, f:dateString}
			];
			
			function taskYPos(taskNr){
				return taskNr*options.rowHeight+options.headHeight+options.rowHeight/2;
			}
			
			var R = Raphael(container.get(0));
			
			function drawGrid(){
				var step = options.rowHeight;
				R.rect(0, 0, width, height).attr({stroke:options.grid.color});
				for(var i=0; i<data.tasks.length; i++){
					var y = i*step+options.headHeight;
					var p = R.path(["M0,", y, "L", width, y]).attr({stroke:options.grid.color});
					if(i==0) p.attr({"stroke-width":2});
					
				}
			}
			
			function Capture(evt){
				this.evt = evt;
				this.target = evt.currentTarget;
			}
			Capture.buildColumn = function(set){
				set.attr({cursor:"pointer"})
					.drag(
						function(dx, dy, x, y, evt){//move
							if(!Capture.current) return;
							set.attr({transform:["t", dx, 0]});
						},
						function(x, y, evt){ //start
							Capture.current = new Capture(evt);
						},
						function(){ //end
							Capture.current = null;
						}
					);
			}
			
			function drawTable(){
				function colPos(colNr){
					var pos = 0;
					for(var i=0; i<columns.length; i++){
						if(i>=colNr) return pos;
						pos+=columns[i].w;
					}
					return pos;
				}
				function drawCol(colNr){
					var col = columns[colNr];
					var x = colPos(colNr);
					var txtX = col.mrgLeft==null?col.w/2:col.mrgLeft;
					
					col.set = R.set();
					
					col.set.push(R.rect(x, 0, width, height).attr({fill:"#fff", stroke:options.grid.color}));
					col.set.push(R.text(x+col.w/2, options.headHeight/2, col.title).attr({"text-anchor":"middle", "font-weight":"bold"}));
					
					$.each(data.tasks, function(i,task){
						var levelOffset = col.fld=="name"?options.taskLevelOffset*taskLevel(task.id):0;
						var txt = R.text(x+txtX+levelOffset, taskYPos(i), col.f?col.f(task[col.fld]):task[col.fld])
							.attr({"text-anchor":col.mrgLeft?"start":"middle"});
						col.set.push(txt);
					});
					if(colNr>1) Capture.buildColumn(col.set);
				}
				
				for(var i=0; i<columns.length; i++){
					drawCol(i);
				}
			}
			
			function drawChart(){
				var left = 0;
				for(var i=0; i<columns.length; i++) left+=columns[i].w;
				
				var chartSet = R.set();
				chartSet.push(R.rect(left, 0, width, height).attr({fill:"#fff", stroke:options.grid.color}));
				
				var chartWidth = width - left;
				var dayStep = chartWidth/dateRange.days;
				
				(function buildHeader(){
					var middle = options.headHeight/2;
					chartSet.push(R.path(["M",left,middle,"L",width+left,middle]).attr({stroke:options.grid.color}));
					var d = new Date(dateRange.min);
					for(var i=0; i<width/dayStep; i++){
						var x = left+i*dayStep;
						chartSet.push(R.path(["M",x,middle,"L",x,options.headHeight]).attr({stroke:options.grid.color}));
						chartSet.push(R.text(x+dayStep/2, options.headHeight*.75, d.getDate()).attr({"text-anchor":"middle"}));
						d.setDate(d.getDate()+1);
						if(d.getDate()==2)
							chartSet.push(R.path(["M",x,0,"L",x,options.headHeight]).attr({stroke:options.grid.color}));
						if(d.getDate()==15)
							chartSet.push(R.text(x,options.headHeight*.25, formatMonth(d)+" "+(1900+d.getYear())).attr({"text-anchor":"middle"}));
					}
				})();
				
				function getTaskRange(task){
					return {
						begin: Math.floor(dateRange.getDays(dateRange.min, task.actualStart)),
						length: Math.ceil(dateRange.getDays(task.actualStart, task.actualEnd))+1
					};
				}
				
				function getTaskRect(rowNr, task){
					if(taskIndex[task.id].rect) return taskIndex[task.id].rect;
					var tRange = getTaskRange(task);
					var rect = {
						x:left+tRange.begin*dayStep,
						y:taskYPos(rowNr)-options.rowHeight*.25,
						w:tRange.length*dayStep,
						h:options.rowHeight/2
					};
					return taskIndex[task.id].rect = rect;
				}
				
				(function drawTasks(){
					var arrowSize = 5;
					function drawArrow(x, y){
						chartSet.push(R.path([
							"M", x, y,
							"L", x+arrowSize, y+arrowSize,
							"L", x+arrowSize*2, y,
							"Z"
						]).attr({stroke:null, fill:options.complexTask.color}));
					}
					$.each(data.tasks, function(i,task){
						var tReg = taskIndex[task.id];
						var isComplex = tReg.children!=null;
						tReg.row = i;
						var tRect = getTaskRect(i, task);
						chartSet.push(
							R.rect(tRect.x, tRect.y, tRect.w, tRect.h).attr({fill:isComplex?options.complexTask.color:options.task.color, stroke:null})
						);
						if(isComplex){
							drawArrow(tRect.x, tRect.y+tRect.h);
							drawArrow(tRect.x+tRect.w-arrowSize*2, tRect.y+tRect.h);
						}
						if(task.progress){
							var margin = tRect.h*.2;
							chartSet.push(
								R.rect(tRect.x+margin, tRect.y+margin, (tRect.w-margin*2)*task.progress, tRect.h-margin*2).attr({stroke:null, fill:options.task.progressColor})
							);
						}
					});
				})();
				
				(function drawLinks(){
					var stubLng = 5,
						arrowSize = 5;
					$.each(data.tasks, function(i, task){
						if(!task.next) return;
						
						function drawLink(task, nextID){
							var tRect = getTaskRect(i, task);
							var tNext = taskIndex[nextID];
							var nxtRect = getTaskRect(tNext.row, tNext);
							var y1 = tRect.y+tRect.h/2, 
								y2 = nxtRect.y+nxtRect.h/2;
							var dy = y2-y1,
								dx = (nxtRect.x-stubLng-arrowSize) - (tRect.x+tRect.w+stubLng);
								
							var path = [
									"M", tRect.x+tRect.w, y1,
									"L", tRect.x+tRect.w+stubLng, y1,
									dx>=0?["L", nxtRect.x-stubLng-arrowSize-dx, y2,]
									:[
										"L", tRect.x+tRect.w+stubLng, y1+dy/2,
										"L", nxtRect.x-stubLng-arrowSize, y2-dy/2,
										"L", nxtRect.x-stubLng-arrowSize, y2
									],
									"L", nxtRect.x, y2
								];
							chartSet.push(R.path(path).attr({stroke:options.link.color}));
							chartSet.push(
								R.path([
									"M", nxtRect.x, y2,
									"L", nxtRect.x-arrowSize, y2-arrowSize,
									"L", nxtRect.x-arrowSize, y2+arrowSize,
									"Z"
								]).attr({stroke:null, fill:options.link.color})
							);
						}
						
						if(task.next instanceof Array)
							$.each(task.next, function(i, tn){drawLink(task, tn);});
						else
							drawLink(task, task.next);
					});
				})();
				
				Capture.buildColumn(chartSet);
			}
			
			drawTable();
			drawChart();
			if(options.grid.draw)
				drawGrid();
			R.path(["M",0,options.headHeight, "L",width,options.headHeight]).attr({stroke:options.grid.color, "stroke-width":2});
		}
		
		
		draw($(this), data);
		
	};
})(jQuery);