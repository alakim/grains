(function($,H){
	function buildItem(el, columns){
		var cols = el.find("tr:eq(0)>*");
		$.each(columns, function(i, cIdx){
			el.find("tr").each(function(i, tr){tr=$(tr);
				tr.find("*:eq("+cIdx+")").css({
					color:"red"
				})
				.attr({width:10});
			});
		});
	}
	
	$.fn.vAccordion = function(columns){
		$(this).each(function(i, el){
			buildItem($(el), columns);
		});
	};
	
})(jQuery, Html);