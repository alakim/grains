function RandomColorSet(startingColor){
	this.startingColor = startingColor?startingColor:"ffffff";
	var clr = RandomColorSet.parseColor(this.startingColor);
	this.R = clr.r;
	this.G = clr.g;
	this.B = clr.b;
}

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}
	
	var __ = RandomColorSet;
	
	
	extend(__, {
		step:15,
		volume:135,
		
		randomSteps:function(step){
			var div = 8;
			return (Math.ceil(Math.random()*div*2)-div)*step;
		},
		
		parseColor: function(color){
			var mt = color.match(/^([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/);
			return mt?{
				r: parseInt("0x"+mt[1]),
				g: parseInt("0x"+mt[2]),
				b: parseInt("0x"+mt[3])
			}:null;
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
		},
		
		variate: function(v){
			return ((v+__.randomSteps(__.step))%__.volume)+__.volume;
		},
		
		contra: function(color){
			var clr = __.parseColor(color);
			var c = 255;
			var s = Math.ceil(c/2);
			return __.formatColor((clr.r+s)%c, (clr.g+s)%c, (clr.b+s)%c);
		}
	});
	
	__.prototype = {
		startingColor:"ffffff",
		R:0xff,
		G:0xff,
		B:0xff,
		
		next: function(){var _=this;
			_.R = __.variate(_.R);
			_.G = __.variate(_.G);
			_.B = __.variate(_.B);
			return __.formatColor(_.R, _.G, _.B);
		}
	};
})();
