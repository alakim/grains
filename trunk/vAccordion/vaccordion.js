(function($,H){
	var templates = {
		table: function(srcTbl){with(Html){
			return div({"class":"vAccordionTable"},
				apply(srcTbl.find("tr"), function(row, i){row=$(row);
					return templates.row(row, i);
				})
			);
		}},
		row: function(row, idx){with(Html){
			return div({"class":"row", rowIdx:idx},
				apply(row.find("*"), function(cell, i){cell=$(cell);
					var classes = ["cell"];
					if(idx==0) classes.push("top");
					if(i==0) classes.push("left");
					if(cell[0].tagName.toUpperCase()=="TH")
						classes.push("header");
					return div({"class":classes.join(" "), cellIdx:i, rowIdx:idx}, cell.text());
				})
			);
		}}
	};
	
	function buildDivTable(el, container){
		container.html(templates.table(el));
	}
	
	function buildItem(el, columns){
		var container =$(H.div()); el.after(container);
		buildDivTable(el, container);
		
		var cols = el.find("tr:eq(0)>*");
		$.each(columns, function(i, cIdx){
			el.find("tr").each(function(i, tr){tr=$(tr);
				tr.find("*:eq("+cIdx+")").css({
					color:"red",
					width:10,
					"overflow-x":"hidden"
				})
				.attr({width:10});
			});
		});
		
		var expandedColumn = -1;
		var colToExpand = -1;
		
		$(".vAccordionTable .cell")
			.mouseover(function(){var _=$(this);
				var colIdx = parseInt(_.attr("cellIdx"));

				if(colIdx==expandedColumn) return;
				if(colIdx==colToExpand) return;
				colToExpand = colIdx;
				
				if(expandedColumn>=0){
					_.parent().parent().find(".cell[cellIdx="+expandedColumn+"]")
						.animate({width:70});
				}
				
				_.parent().parent().find(".cell[cellIdx="+colIdx+"]")
					.animate({width:120}, function(){
						colToExpand = -1;
						expandedColumn = colIdx;
					});
			});
	}
	
	$.fn.vAccordion = function(columns){
		$(this).each(function(i, el){
			buildItem($(el), columns);
		});
	};
	
})(jQuery, Html);