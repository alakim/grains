(function($, $H){
	var pos = 0,
		slideCount;
	
	function init(){
		if(document.location.hash=="#speaker"){
			$(".lecture").addClass("speaker");
			$(".pict img").attr({height:200, width:null});
		}
			
		slideCount = $(".slide").length;
		toBegin();
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
		if(p>=slideCount-1){
			$(".btForward").attr({disabled:true});
		}
		else $(".btForward").attr({disabled:false});
		if(p<1){
			$(".btBackward").attr({disabled:true});
		}
		else $(".btBackward").attr({disabled:false});
		
		if(p>=slideCount || p<0) return;
		
		pos = p;
		$(".slide").hide();
		$(".slide:eq("+pos+")").fadeIn(1000);
		updateDisplay();
	}
	
	function forward(){
		toPosition(pos+1);
	}

	function backward(){
		toPosition(pos-1);
	}

	$(init);
})(jQuery, Html);