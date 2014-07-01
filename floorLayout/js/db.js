define([], function(){
	var data = {
		buildings:{
			"1":{
				floors:{
					"1":{
						"1":{price:100},
						"2":{price:200, sold:true},
						"3":{price:300},
						"4":{price:400},
						"description":"Специальный этаж для VIP-клиентов"
					},
					"2":{
						"21":{price:1100},
						"22":{price:1200, sold:true},
						"23":{price:1300, sold:true},
						"24":{price:1400}
					}
				}
			},
			"2":{
				floors:{
					"1":{
						"1":{price:2100},
						"2":{price:2200, sold:true},
						"3":{price:2300},
						"4":{price:2400}
					}
				}
			}
		}
	};

	return {
		getData: function(bldNr, type, nr, fnr){
			var bld = data.buildings[bldNr+""];
			if(type=="floor") return bld.floors[nr+""];
			if(type=="room") return bld.floors[fnr+""][nr+""];
		}
	};
});