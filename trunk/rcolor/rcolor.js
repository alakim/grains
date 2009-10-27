function RandomColorSet(startingColor){
	this.startingColor = startingColor?startingColor:"ffffff";
	var mt = this.startingColor.match(/^([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/);
	if(mt){
		this.R = parseInt("0x"+mt[1]);
		this.G = parseInt("0x"+mt[2]);
		this.B = parseInt("0x"+mt[3]);
	}
}

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __ = RandomColorSet;
	
	
	extend(__, {
		step:1,
		
		randomSteps:function(step){
			var div = 3;
			return (Math.ceil(Math.random()*div*2)-div)*step;
		},
		
		formatHex: function(d){
			return d<10?d.toString()
			:d==10?"a"
			:d==11?"b"
			:d==12?"c"
			:d==13?"d"
			:d==14?"e"
			:d==15?"f"
			:__.formatHex(Math.floor(d/16))+__.formatHex(d%16);
		},
		
		formatColor: function(r,g,b){
			return (r<16?"0":"")+__.formatHex(r)+
				(g<16?"0":"")+__.formatHex(g)+
				(b<16?"0":"")+__.formatHex(b);
		}
	});
	
	__.prototype = {
		startingColor:"ffffff",
		R:0xff,
		G:0xff,
		B:0xff,
		
		next: function(){var _=this;
			_.R+=__.randomSteps(__.step);
			_.G+=__.randomSteps(__.step);
			_.B+=__.randomSteps(__.step);
			return __.formatColor(_.R, _.G, _.B);
		}
	};
})();
