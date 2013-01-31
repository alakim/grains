(function($){
	$.fn.gantt = function(options, data){
		options = $.extend({
			rowHeight: 20,
			fontSize: 12,
			headHeight: 25,
			grid:{
				color:"#ccc"
			}
		}, options);
		
		var taskIndex = {};
		$.each(data.tasks, function(i,t){
			taskIndex[t.id] = {id:t.id, parent:t.parent, level:0};
		});
	
		
		function drawChart(container, data){

			var width = container.width(),
				height = container.height();
			var columns = [
				{w:25, fld:"id"},
				{w:125, fld:"name", mrgLeft:5},
				{w:65, fld:"actualStart", mrgLeft:5},
				{w:65, fld:"actualEnd", mrgLeft:5}
			];
			
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
						var y = i*options.rowHeight+options.headHeight;
						var txt = R.text(x+txtX, y+options.rowHeight/2, task[col.fld])
							.attr({"text-anchor":col.mrgLeft?"start":"middle"});
					});
				}
				
				for(var i=0; i<columns.length; i++){
					drawCol(i);
				}
			}
			
			drawTable();
			drawGrid();
		}
		
		
		drawChart($(this), data);
		
	};
})(jQuery);