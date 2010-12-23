var Calc = (function(){
	function each(c,F){
		if(c instanceof Array) for(var i=0; i<c.length; i++) F(c[i], i);
		else for(var k in c) F(c[k], k);
	}
	
	function extend(o,s){
		for(var k in s)o[k] = s[k];
	}
	
	var instances = [];
	
	function __(name){
		this.name = name;
		this.idx = instances.length;
		instances.push(this);
	}
	
	__.prototype ={
		add: function(x, y){return x+y;},
		sub: function(x, y){return x-y;},
		div: function(x, y){return x/y;},
		mul: function(x, y){return x*y;},
		cos: function(x){return Math.cos(x);}
	};
	
	extend(__, {
		version:"1.1",
		getInstance: function(idx){return instances[idx];}
	});
	
	return __;
})();

var Display = {
	width:100,
	height:199,
	panelID:"displayPanel",
	subscribers:[], // недокументированное свойство
	show: function(time){var _=this;
		function s(){document.getElementById(_.panelID).style.display = "block";}
		if(!time) s(); else setTimeout(s, time);
	},
	update: function(){}// недокументированный метод
};
