function FDict(coll){var _=this;
	_.dict = {};
	_.words = [];
	_.dictSize = 0;
	if(coll) _.addCollection(coll);		
}

(function(){

	function extend(o,s){for(var k in s)o[k]=s[k];}

	function each(coll, F){
		if(coll==null) return;
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

	var __=FDict;

	function moveWindow(word, F){
		for(var pos=0; pos<=word.length-__.windowSize; pos++){
			F(word.slice(pos, pos+__.windowSize), pos);
		}
	}

	extend(__, {
		windowSize: 3
	});
	
	function filterByThreshold(res1, threshold){
		if(!threshold)
			return res1;
		var res = [];
		each(res1, function(el){
			if(el.rate>threshold)
				res.push(el);
		});
		return res;
	}
	
	function filterDelta(res1){
		if(res1.length<3)
			return res1;
			
		var delta = [];
		for(var i=1; i<res1.length; i++){
			var el = res1[i];
			var prev = res1[i-1];
			delta.push({d:prev.rate - el.rate, i:i});
		}
		
		delta = delta.sort(function(x, y){
			return x.d>y.d?-1
				:x.d<y.d?1
				:0;
		});
		
		var res = [];
		for(var i=0; i<delta[0].i; i++){
			res.push(res1[i]);
		}
		return res;
	}

	extend(FDict.prototype, {
		threshold: 0.7,
		deltaFiltration:false,
		
		addCollection: function(coll){var _=this;
			each(coll, function(w){
				_.add(w);
			});
		},

		add: function(word){var _=this;
			var wordId = _.words.length;
			_.words.push(word);

			moveWindow(word.toLowerCase(), function(str){
				if(!_.dict[str]){
					_.dict[str] = [];
					_.dictSize++;
				}
				_.dict[str].push(wordId);
			})
		},
		
		find: function(word){var _=this;
			word = word.toLowerCase();
			var counters = {};
			moveWindow(word, function(str){
				each(_.dict[str], function(id){
					if(!counters[id])
						counters[id] = 1;
					else
						counters[id]++;
				});
			});
			
			var arr = [];
			var maxCount = 0;
			var maxCountEntries = 0;
			each(counters, function(count, id){
				var word = _.words[id];
				arr.push({count:count, id:id, val:word, rate:count/*/word.length*/});
				if(maxCount<count){
					maxCount = count;
					maxCountEntries = 0;
				}
				else if(count==maxCount)
					maxCountEntries++;
			});
			arr.sort(function(x,y){
				return x.rate>y.rate?-1
						:x.rate<y.rate?1
						:0;
			});
			var res = [];
			each(arr, function(w){
				var word = _.words[w.id];
				res.push({val:w.val, id:w.id, rate:w.count/maxCount});
			});
			
			res = filterByThreshold(res, _.threshold);
			if(_.deltaFiltration)
				res = filterDelta(res);
			return res;
		}
	});
})();