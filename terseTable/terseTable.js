(function($,$H){

	function buildTable(tbl){
		var rows = tbl.find("tr");
		for(var i=rows.length-1; i>=0; i--){var row = $(rows[i]);
			row.find("td").each(function(j, cell){cell = $(cell);
				var prevCell = $(row.prev().find("td").get(j));
				if(prevCell.html()==cell.html()){
					var rspan = parseInt(cell.attr("rowspan") || 1);
					prevCell.attr({rowspan: rspan+1})
					cell.addClass("toRemove");
				}
			});
		}
		tbl.find(".toRemove").remove();
	}
	
	$.fn.terseTable = function(){
		$(this).each(function(i, el){
			buildTable($(el));
		});
	};
})(jQuery, Html);