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

	extend(FDict.prototype, {
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
				res.push({val:w.val, rate:w.count/maxCount});
			});
			return res;
		}
	});
})();