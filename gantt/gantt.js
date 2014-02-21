(function($){
	$.fn.gantt = function(options, data){
		options = $.extend(true, {
			rowHeight: 20,
			fontSize: 12,
			headHeight: 35,
			taskLevelOffset: 15,
			grid:{color:"#ccc", draw:false, minDayStep: 14},
			task:{color:"90-#22a:5-#77f:95", stroke:null, progressColor:"90-#484:5-#aca:95"},
			complexTask:{color:"90-#444:5-#888:95", arrowColor:"#444"},
			link:{color:"#008", highlightColor:"#f00", width:1, captureZone:8},
			slider:{width:3, color:"#ccc"}
		}, options);
		
		if(data.type=="MSProjectXML"){
			data = convertFromMSProjectXML(data);
		}

		var taskIndex = {};
		var dateRange = {min:new Date(2200,0,1), max:new Date(1900, 0,1)};
		
		$.each(data.tasks, function(i,t){
			if(!t) return;
			taskIndex[t.id] = t;
			t.actualStart = parseDate(t.actualStart);
			t.actualEnd = parseDate(t.actualEnd);
			if(t.actualStart<dateRange.min) dateRange.min = t.actualStart;
			if(t.actualEnd>dateRange.max) dateRange.max = t.actualEnd;
		});
		function addDays(date, nDays){date.setDate(date.getDate()+nDays);}
		addDays(dateRange.min, -2); addDays(dateRange.max, 3); // expand boundaries for fine view
		
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
		function parseXmlDate(sDate){
			var re = /(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/;
			var mt = sDate.match(re);
			if(!mt){alert("Error parsing date '"+sDate+"'"); return;}
			var y = parseInt(mt[1], 10),
				m = parseInt(mt[2], 10),
				d = parseInt(mt[3], 10);
			var res = new Date(y, m-1, d);
			res.setHours(parseInt(mt[4], 10));
			res.setMinutes(parseInt(mt[5], 10));
			res.setSeconds(parseInt(mt[6], 10));
			return res;
		}
		
		function parseDate(sDate){
			if(sDate.match(/T/)) return parseXmlDate(sDate);
			
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
		
		function formatDate(dt){
			var d = dt.getDate(),
				m = dt.getMonth()+1,
				y = dt.getYear()+1900;
			if(d<10) d = "0"+d;
			if(m<10) m = "0"+m;
			return [d,m,y].join(".");
		}
		
		function convertFromMSProjectXML(data){
			function getParentOutline(outNr){
				var re = /\.\d+$/i;
				var mt = outNr.match(re);
				if(!mt) return null;
				return outNr.replace(re, "");
			}
			
			var tasks = [];
			var dict = {}, dictID = {};
			for(var i=0; i<data.tasks.length; i++){var srcTask = data.tasks[i];
				var task = {
					id: srcTask.id,
					name:srcTask.name,
					parent:getParentOutline(srcTask.outlineNumber),
					progress:srcTask.progress || 0,
					actualStart:srcTask.start,
					actualEnd:srcTask.finish
				};
				dict[srcTask.outlineNumber] = task;
				dictID[task.id] = task;
				tasks.push(task);
			}
			for(var i=0; i<data.tasks.length; i++){var srcTask = data.tasks[i];
				if(!srcTask.predecessor) continue;
				var pred = dictID[srcTask.predecessor];
				if(!pred.next) pred.next = srcTask.id;
				else{
					if(pred.next instanceof Array) pred.next.push(srcTask.id);
					else{
						var nxt = pred.next;
						pred.next = [nxt, srcTask.id];
					}
				}
			}
			for(var i=0; i<tasks.length; i++){var tsk = tasks[i];
				if(tsk.parent)
					tsk.parent = dict[tsk.parent].id;
			}
			
			return {tasks:tasks};
		}
		
		function draw(container, data){
			var width = container.width(),
				height = container.height();
			var columns = [
				{w:25, fld:"id", title:"№"},
				{w:125, fld:"name", title:"Наименование", mrgLeft:5},
				{w:65, fld:"actualStart", title:"Вр.нач.", mrgLeft:5, f:formatDate},
				{w:65, fld:"actualEnd", title:"Вр.кон.", mrgLeft:5, f:formatDate}
			];
			
			function taskYPos(taskNr){
				return taskNr*options.rowHeight+options.headHeight+options.rowHeight/2;
			}
			
			var R = Raphael(container.get(0));
			
			function drawGrid(){
				var step = options.rowHeight;
				R.rect(0, 0, width, height).attr({stroke:options.grid.color});
				for(var i=0; i<=data.tasks.length; i++){
					var y = i*step+options.headHeight;
					var p = R.path(["M0,", y, "L", width, y]).attr({stroke:options.grid.color});
					if(i==0) p.attr({"stroke-width":2});
					
				}
			}
			
			function Capture(evt){
				this.evt = evt;
				this.target = evt.currentTarget;
			}
			Capture.buildColumn = function(set, colX){
				var slider = R.rect(colX, 0, options.slider.width, height)
					.attr({stroke:null, fill:options.slider.color, cursor:"w-resize"});
				set.push(slider);
				slider.drag(
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
						if(!task) return;
						var levelOffset = col.fld=="name"?options.taskLevelOffset*taskLevel(task.id):0;
						var txt = R.text(x+txtX+levelOffset, taskYPos(i), col.f?col.f(task[col.fld]):task[col.fld])
							.attr({"text-anchor":col.mrgLeft?"start":"middle"});
						col.set.push(txt);
					});
					if(colNr>1) Capture.buildColumn(col.set, x);
				}
				
				for(var i=0; i<columns.length; i++){
					drawCol(i);
				}
			}
			
			var popup = {
				margin:10,
				rowHeight:10,
				init: function(){
					popup.height = popup.rowHeight*2+popup.margin*2;
					popup.window = R.set();
					popup.frame = R.rect(0, 0, 100, popup.height)
						.attr({stroke:"#88a", fill:"#ffe"});
					popup.window.push(popup.frame);
					popup.window.hide();
					
					popup.fields = {};
					popup.fields.name = R.text(popup.margin, popup.margin, "").attr({"text-anchor":"start"}); 
					popup.window.push(popup.fields.name);
					popup.fields.time = R.text(popup.margin, popup.margin+popup.rowHeight, "").attr({"text-anchor":"start"}); 
					popup.window.push(popup.fields.time);
					popup.fields.progress = R.text(popup.margin, popup.margin+popup.rowHeight*2, "").attr({"text-anchor":"start"}); 
					popup.window.push(popup.fields.progress);
					
				},
				show: function(task, evt){
					var offset = 10;
						
					popup.fields.name.attr({text:task.name});
					popup.fields.time.attr({text:formatDate(task.actualStart)+" - "+formatDate(task.actualEnd)});
					popup.fields.progress.attr({text:"выполнено на "+Math.round(task.progress*100)+"%"});
					var w = Math.max(
						popup.fields.name.getBBox().width,
						popup.fields.time.getBBox().width,
						popup.fields.progress.getBBox().width
					)+popup.margin*2;
					popup.frame.attr({width:w});
					
					var x = evt.layerX+offset,
						y = evt.layerY+offset;
					if(x>width-w)
						x = evt.layerX - w - offset;
					if(y>height-popup.height)
						y = evt.layerY - popup.height - offset;
					popup.window.attr({transform:["t", x, y]}).show();
				},
				hide: function(){
					popup.window.hide();
				}
			};
			
			function drawChart(){
				var left = 0;
				for(var i=0; i<columns.length; i++) left+=columns[i].w;
				
				var chartSet = R.set();
				chartSet.push(R.rect(left, 0, width, height).attr({fill:"#fff", stroke:options.grid.color}));
				
				var chartWidth = width - left;
				var dayStep = chartWidth/dateRange.days, dayGroup = 1;
				for(dayGroup=1; dayStep*dayGroup<options.grid.minDayStep; dayGroup++);
				
				(function buildHeader(){
					var middle = options.headHeight/2;
					chartSet.push(R.path(["M",left,middle,"L",width+left,middle]).attr({stroke:options.grid.color}));
					var d = new Date(dateRange.min);
					for(var i=0; i<width/(dayStep*dayGroup); i++){
						var x = left+i*dayStep*dayGroup;
						var dat = d.getDate();
						
						chartSet.push(R.path(["M",x,middle,"L",x,options.headHeight]).attr({stroke:options.grid.color}));
						chartSet.push(R.text(x+dayStep*dayGroup/2, options.headHeight*.75, dat).attr({"text-anchor":"middle"}));
						if(dat>0 && dat<=dayGroup)
							chartSet.push(R.path(["M",x,0,"L",x,options.headHeight]).attr({stroke:options.grid.color}));
						if(dat>15 && dat<=15+dayGroup)
							chartSet.push(R.text(x,options.headHeight*.25, formatMonth(d)+" "+(1900+d.getYear())).attr({"text-anchor":"middle"}));
						
						d.setDate(dat+dayGroup);
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
					function drawEdgeMarker(x, y){
						chartSet.push(R.path([
							"M", x, y,
							"L", x+arrowSize, y+arrowSize,
							"L", x+arrowSize*2, y,
							"Z"
						]).attr({stroke:null, fill:options.complexTask.arrowColor}));
					}
					$.each(data.tasks, function(i,task){
						if(!task) return;
						var tReg = taskIndex[task.id];
						var isComplex = tReg.children!=null;
						tReg.row = i;
						var tRect = getTaskRect(i, task);
						var taskLine;
						function highlightOn(evt){
							popup.show(task, evt);
							if(isComplex)return;
							taskLine.attr({stroke:options.link.highlightColor});
							if(task.links) $.each(task.links, function(i, lnk){
								lnk.line.attr({stroke:options.link.highlightColor});
								lnk.arrow.attr({stroke:options.link.highlightColor, fill:options.link.highlightColor});
								lnk.captureZone.attr({opacity:.2});
							});
						}
						function highlightOff(){
							popup.hide();
							if(isComplex)return; 
							taskLine.attr({stroke:options.task.stroke});
							if(task.links) $.each(task.links, function(i, lnk){
								lnk.line.attr({stroke:options.link.color});
								lnk.arrow.attr({stroke:options.link.color, fill:options.link.color});
								lnk.captureZone.attr({opacity:0});
							});
						}
						
						chartSet.push(
							taskLine = R.rect(tRect.x, tRect.y, tRect.w, tRect.h)
								.attr({fill:isComplex?options.complexTask.color:options.task.color, stroke:options.task.stroke, "stroke-width":1})
								.mouseover(highlightOn)
								.mouseout(highlightOff)
						);
						if(isComplex){
							drawEdgeMarker(tRect.x, tRect.y+tRect.h);
							drawEdgeMarker(tRect.x+tRect.w-arrowSize*2, tRect.y+tRect.h);
						}
						if(task.progress){
							var margin = tRect.h*.2;
							chartSet.push(
								R.rect(tRect.x+margin, tRect.y+margin, (tRect.w-margin*2)*task.progress, tRect.h-margin*2)
									.attr({stroke:null, fill:options.task.progressColor})
									.mouseover(highlightOn)
									.mouseout(highlightOff)
							);
						}
					});
				})();
				
				(function drawLinks(){
					var stubLng = 5,
						arrowSize = 5;
						
					$.each(data.tasks, function(i, task){
						if(!task || !task.next) return;
						
						function drawLink(task, nextID){
							var tRect = getTaskRect(i, task);
							var tNext = taskIndex[nextID];
							if(!task.links) task.links = [];
							if(!tNext.links) tNext.links = [];
							var nxtRect = getTaskRect(tNext.row, tNext);
							var y1 = tRect.y+tRect.h/2, 
								y2 = nxtRect.y+nxtRect.h/2;
							var dy = y2-y1,
								dx = (nxtRect.x-stubLng-arrowSize) - (tRect.x+tRect.w+stubLng),
								rowCorrection = Math.ceil(dy/options.rowHeight)%2?0:options.rowHeight/2;
								
							var path = [
									"M", tRect.x+tRect.w, y1,
									"L", tRect.x+tRect.w+stubLng+(dx>=0?dx/2:0), y1,
									dx>=0?["L", nxtRect.x-stubLng-arrowSize-dx/2, y2,]
									:[
										"L", tRect.x+tRect.w+stubLng, y1+dy/2+rowCorrection,
										"L", nxtRect.x-stubLng-arrowSize, y2-dy/2+rowCorrection,
										"L", nxtRect.x-stubLng-arrowSize, y2
									],
									"L", nxtRect.x, y2
								];
							var lnkSet = R.set();
							var arrow, captureZone, line;
							function highlightOn(){
								var clr = options.link.highlightColor;
								lnkSet.attr({stroke:clr}); arrow.attr({fill:clr});
								captureZone.attr({opacity:.2});
							}
							function highlightOff(){
								var clr = options.link.color;
								lnkSet.attr({stroke:clr}); arrow.attr({fill:clr});
								captureZone.attr({opacity:0});
							}
							
							captureZone = R.path(path).attr({stroke:"#ff0", "stroke-width":options.link.captureZone, opacity:0})
								.mouseover(highlightOn).mouseout(highlightOff)
							
							lnkSet.push( // drawing line
								line = R.path(path).attr({stroke:options.link.color, "stroke-width":options.link.width})
									.mouseover(highlightOn).mouseout(highlightOff)
							);
							lnkSet.push( // drawing arrow
								arrow = R.path([
									"M", nxtRect.x, y2,
									"L", nxtRect.x-arrowSize, y2-arrowSize,
									"L", nxtRect.x-arrowSize, y2+arrowSize,
									"Z"
								]).attr({stroke:null, fill:options.link.color})
								.mouseover(highlightOn).mouseout(highlightOff)
							);
							chartSet.push(lnkSet);
							var lineObjects = {line:line, captureZone:captureZone, arrow:arrow};
							task.links.push(lineObjects);
							tNext.links.push(lineObjects);
						}
						
						if(task.next instanceof Array)
							$.each(task.next, function(i, tn){drawLink(task, tn);});
						else
							drawLink(task, task.next);
					});
				})();
				
				Capture.buildColumn(chartSet, left);
			}
			
			drawTable();
			drawChart();
			if(options.grid.draw)
				drawGrid();
			R.path(["M",0,options.headHeight, "L",width,options.headHeight]).attr({stroke:options.grid.color, "stroke-width":2});
			popup.init();
		}
		
		
		draw($(this), data);
			
		
	};
})(jQuery);