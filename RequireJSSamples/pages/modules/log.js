define(["lib/jquery-1.7.2.min", "lib/html"], function(){
	return {
		write: function(msg){
			$(".samplePanel").append(Html.p(msg));
		}
	};
});