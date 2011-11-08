if(typeof($)!="function") alert("jquery.js module required!");

var Correlator = (function(){
	function trim(str){
		return str.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	
	
	var _ = {
		getMatrix: function(txt){
			return [
				{x:10, y:20, v:30},
				{x:40, y:50, v:100},
				{x:15, y:30, v:99}
			];
		}
	};
	return _;
})();