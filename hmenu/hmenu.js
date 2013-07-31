(function($,H){
	
	function buildMenu(pnl){
		pnl.show();
	}
	
	$.fn.HMenu = function(){
		$(this).each(function(i, el){
			buildMenu($(el));
		});
	};
})(jQuery, Html);
