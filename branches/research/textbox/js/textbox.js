(function($, $H){
	function log(msg){
		$("#console").append($H.div(msg));
	}
	
	function init(tbox){
		tbox.val("Тестовый текст");
		tbox.select(function(ev, x, y){
			log($H.markup("Selected from ", ev.currentTarget.selectionStart, " to ", ev.currentTarget.selectionEnd));
		});
	}
	
	$(function(){
		//console.log($(".tbInput"));
		$(".tbInput").each(function(i, el){
			
			init($(el));
		});
	});
})(jQuery, Html);