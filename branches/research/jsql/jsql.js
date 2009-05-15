var JSQL = {};

(function(){
	function extend(o, s){for(var k in s)o[k]=s[k];}
	
	function each(coll, F){
		if(!coll) return;
		for(var i=0; i<coll.length; i++)
			F(coll[i], i);
	}
	
	extend(JSQL, {
		version: "0.0.0",
		
		DataBase: function(data){var _=this;
			_.tablesCount = 0;
			_.tables = {};
			each(data, function(itm){
				if(itm.constructor==JSQL.Table){
					_.tablesCount++;
					if(!(itm.name && itm.name.length))
						itm.name = "table"+_.tablesCount;
					_.tables[itm.name] = itm;
				}
			});
		},
		
		Table: function(name, rows){
			this.name = name;
			this.rows = rows;
		}
	});
	
	JSQL.DataBase.prototype = {
		select: function(column, statements){var _=this;
			var table = _.tables[statements.from]
			var res = [];
			each(table.rows, function(row){
				if(row[column])
					res.push(row[column]);
			});
			return res;
		}
	};
})();