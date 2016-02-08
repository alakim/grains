var Parser = (function(){
	function extend(o,s){for(var k in s) o[k] = s[k];}
	
	function ParserMnd(ext){
		extend(this, ext);
	}
	ParserMnd.prototype = {
		parse: function(srcStr){
			return {
				success:true,
				value: "",
				type: "empty"
			};
		},
		next: function(prs){
			var _=this;
			return new ParserMnd({
				parse: function(srcStr, prev){
					var res1 = _.parse(srcStr);
					if(!res1 || !res1.pos) return false;
					var res2 = prs.parse(srcStr.substr(res1.pos), res1);
					return prev?[prev, res2]:res2;
				}
			});
		},
		skip: function(prs){
			var _=this;
			return new ParserMnd({
				parse: function(srcStr, prev){
					var res1 = _.parse(srcStr);
					if(!res1 || !res1.pos) return false;
					var res2 = prs.parse(srcStr.substr(res1.pos), res1);
					return prev?[prev, res2]:res2;
				}
			});
		}
	};
	
	var Parser = {
		version: "1.0.0",
		string: function(str, type){
			return new ParserMnd({
				parse: function(srcStr, prev){
					var sourceString = srcStr;
					if(srcStr.indexOf(str)!=0) return false;
					var pos = str.length;
					var res = {
						value: str,
						type: type
					};
					if(pos==srcStr.length) res.success = true;
					else res.pos = pos;
					return prev?[prev, res]:res;
				}
			});
		}
	};
	return Parser;
})();