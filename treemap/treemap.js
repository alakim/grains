(function($,R){
	function buildMap(el, data){
		
	}
	
	$.fn.treemap = function(data){
		$(this).each(function(i, el){el=$(el);
			buildMap(el, data);
		});
	};
})(jQuery, Raphael);