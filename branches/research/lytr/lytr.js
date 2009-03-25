// Lilypond Transposition tool
var LyTr = {
};

(function(){
	function each(coll, F){
		if(typeof(coll.length)!="undefined"){
			for(var i=0; i<coll.length; i++){
				F(coll[i], i);
			}
		}
		else{
			for(var k in coll){
				F(coll[k], k);
			}
		}
	}
	
	function extend(o,s){
		for(var k in s)
			o[k] = s[k];
	}
	
	var scale = {
		sharpMode:"c cis d dis e f fis g gis a ais b".split(" "),
		flatMode:"c des d es e f ges g aes a bes b".split(" "),
		index:{}
	}
	
	each([scale.sharpMode, scale.flatMode], function (pitchList){
		each(pitchList, function(pitch, i){
			scale.index[pitch] = i;
		});
	});
	
	function transposePitch(pitch, interval, sharpMode){
		var degree = (scale.index[pitch] + interval)%12;
		if(degree<0)
			degree+=12;
		return sharpMode? scale.sharpMode[degree] :scale.flatMode[degree];
	}
	
	extend(LyTr, {
		version: "1.0.95",
		sharpMode: true,
		
		transpose: function(src, interval, sharpMode){
			sharpMode = sharpMode==null ?LyTr.sharpMode :sharpMode;
			var res = src.replace(/([abcdefgh]((is)|(e?s))?)(\d*)/ig, function($0, $1, $2, $3, $4, $5){
				return transposePitch($1, interval, sharpMode)+$5;
			});
			return res;
		}
	});
})();
