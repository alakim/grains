(function($, $H){
	var pos = 0,
		slideCount;
	
	function init(){
		slideCount = $(".slide").length;
		$(".slide:eq(0)").show();
		$(".btForward").click(forward);
		$(".btBackward").click(backward);
		updateDisplay();
		$("body").keypress(function(e){
			if(e.charCode==32){
				if(e.shiftKey) backward();
				else forward();
			}
			else if(e.keyCode==37 || e.keyCode==33) backward();
			else if(e.keyCode==39 || e.keyCode==34) forward();
			else if(e.keyCode==36) toBegin();
			else if(e.keyCode==35) toEnd();
			
			//console.log(e.keyCode, e.charCode, e.shiftKey, e.ctrlKey, e.altKey);
		});
	}
	
	function updateDisplay(){
		$(".display").html((pos+1)+"/"+slideCount);
	}
	
	function toBegin(){
		toPosition(0);
	}
	
	function toEnd(){
		toPosition(slideCount-1);
	}
	
	function toPosition(p){
		pos = p;
		$(".slide").hide();
		$(".slide:eq("+pos+")").show();
		updateDisplay();
	}
	
	function forward(){
		if(pos>=slideCount-1) return;
		toPosition(++pos);
	}

	function backward(){
		if(pos<1) return;
		toPosition(--pos);
	}

	$(init);
})(jQuery, Html);