(function($){
	$.fn.gantt = function(options, data){
		options = $.extend({
			rowHeight: 20,
			fontSize: 12,
			headHeight: 25,
			taskLevelOffset: 15,
			grid:{
				color:"#ccc"
			}
		}, options);
		
		var taskIndex = {};
		var dateRange = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent};
			t.actualStart = parseDate(t.actualStart);
			t.actualEnd = parseDate(t.actualEnd);
			
		});
		
		function taskLevel(id){
			var tDef = taskIndex[id];
			if(tDef.level!=null) return tDef.level;
			return tDef.level = tDef.parent?taskLevel(tDef.parent)+1:0;
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
				{w:25, fld:"id"},
				{w:125, fld:"name", mrgLeft:5},
				{w:65, fld:"actualStart", mrgLeft:5, f:dateString},
				{w:65, fld:"actualEnd", mrgLeft:5, f:dateString}
			];
			
			function taskYPos(taskNr){
				return taskNr*options.rowHeight+options.headHeight+options.rowHeight/2;
			}
			
			var R = Raphael(container.get(0));
			
			function drawGrid(){
				var step = options.rowHeight;
				for(var i=0; i<data.tasks.length; i++){
					var y = i*step+options.headHeight;
					R.path(["M0,", y, "L", width, y]).attr({stroke:options.grid.color});
				}
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
					
					R.rect(x, 0, col.w, height).attr({fill:"#fff", stroke:options.grid.color});
					$.each(data.tasks, function(i,task){
						var levelOffset = col.fld=="name"?options.taskLevelOffset*taskLevel(task.id):0;
						var txt = R.text(x+txtX+levelOffset, taskYPos(i), col.f?col.f(task[col.fld]):task[col.fld])
							.attr({"text-anchor":col.mrgLeft?"start":"middle"});
					});
				}
				
				for(var i=0; i<columns.length; i++){
					drawCol(i);
				}
			}
			
			function drawChart(){
				var left = 0;
				for(var i=0; i<columns.length; i++) left+=columns[i].w;
				var chartBg = R.rect(left, 0, width-left, height).attr({fill:"#fff", stroke:options.grid.color});
				$.each(data.tasks, function(i,task){
					R.text(left+20, taskYPos(i), "slslslsl");

				});
			}
			
			drawTable();
			drawChart();
			drawGrid();
		}
		
		
		draw($(this), data);
		
	};
})(jQuery);