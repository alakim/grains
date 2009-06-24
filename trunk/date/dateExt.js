var DateExt = {
	version: "1.1.171"
};

(function(){
	function extend(o,s){for(var k in s){o[k]=s[k];}}
	
	function MonthDef(shortName, fullName, nameGenitive){
		this.shortName = shortName;
		this.fullName = fullName;
		this.nameGenitive = nameGenitive;
	}
	
	var months = [
		new MonthDef("���", "������", "������"),
		new MonthDef("���", "�������", "�������"),
		new MonthDef("���", "����", "�����"),
		new MonthDef("���", "������", "������"),
		new MonthDef("���", "���", "���"),
		new MonthDef("���", "����", "����"),
		new MonthDef("���", "����", "����"),
		new MonthDef("���", "������", "�������"),
		new MonthDef("���", "��������", "��������"),
		new MonthDef("���", "�������", "�������"),
		new MonthDef("���", "������", "������"),
		new MonthDef("���", "�������", "�������")
	];
	
	function DayDef(shortName, fullName, nameAccusative){
		this.shortName = shortName;
		this.fullName = fullName;
		this.nameAccusative = nameAccusative?nameAccusative
			:fullName.replace(/�$/, "�");
	}
	
	var days = [
		new DayDef("��", "�����������"),
		new DayDef("��", "�����������"),
		new DayDef("��", "�������"),
		new DayDef("��", "�����"),
		new DayDef("��", "�������"),
		new DayDef("��", "�������"),
		new DayDef("��", "�������")
	];
	
	function capitalize(str){
		return str.substr(0, 1).toUpperCase()+str.substr(1);
	}
	
	function twoDigits(n){
		return (n<10?"0":"")+n;
	}
	
	var _ = DateExt;
	
	extend(_, {
		
		format:{
			local:{
				toString: function(date, accusativeCase){
					accusativeCase = accusativeCase!=null?accusativeCase:false;
					return [
						days[date.getDay()][accusativeCase?"nameAccusative":"fullName"]+",",
						date.getDate(),
						months[date.getMonth()].nameGenitive,
						date.getFullYear(),
						"�."
					].join(" ");
				}
			},
			
			localWithTime: {
				toString: function(date, accusativeCase){
					accusativeCase = accusativeCase!=null?accusativeCase:false;
					var h = date.getHours();
					var m = date.getMinutes();
					if(h==0 && m==0)
						return _.format.local.toString(date, accusativeCase);
					
					return [
						_.format.local.toString(date, accusativeCase),
						"�",
						h+":"+m
					].join(" ");
				}
			},
			
			shortDigits:{
				toString: function(date){
					return [
						twoDigits(date.getDate()),
						twoDigits(date.getMonth()+1),
						date.getFullYear()
					].join(".");
				}
			},
			
			shortDigitsWithTime:{
				toString: function(date){
					var h = date.getHours();
					var m = date.getMinutes();
					if(h==0 && m==0)
						return _.format.shortDigits.toString(date);
					return [
						_.format.shortDigits.toString(date),
						"�",
						h+":"+m
					].join(" ");
				}
			},
			
			xsd:{
				toString: function(date){
					return [
						date.getFullYear(),
						twoDigits(date.getMonth()+1),
						twoDigits(date.getDate())
					].join("-");
				}
			},
			
			xsdWithTime: {
				toString: function(date){
					return [
						_.format.xsd.toString(date),
						"T",
						[
							twoDigits(date.getHours()),
							twoDigits(date.getMinutes()),
							twoDigits(date.getSeconds())
						].join(":")
					].join("");
				},
				
				parse: function(str){
					var mt = str.match(/(\d{4})\-0?(\d+)\-0?(\d+)T0?(\d+):0?(\d+)(:0?(\d+))?/i);
					if(!mt){
						throw "Error parsing date '"+str+"'";
					}
					var Y = parseInt(mt[1]);
					var M = parseInt(mt[2])-1;
					var D = parseInt(mt[3]);
					var h = parseInt(mt[4]);
					var m = parseInt(mt[5]);
					var s = mt[7]?parseInt(mt[7]):0;
					return new Date(Y, M, D, h, m, s);
				}
			}
		}
		
	});
	
	if(typeof(JSUnit)=="object"){
		_.internals = {
			days:days
		}
	}
})();
