function $(id){return document.getElementById(id);}

function write(msg){$("out").innerHTML+=msg;}
function writeLine(msg){write(msg+"<br>")}
function cls(){$("out").innerHTML = "";}

function each(coll, F){
	if(coll.length){
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

function extend(o, s){for(var k in s)o[k] = s[k];}
