(function($, $H, $R){
	var size = {w:800, h:600};
	var panelPos;
	var paper;
	
	function Vector(x, y){
		switch(arguments.length){
			case 2: this.x = x; this.y = y; break;
			case 1: if(x instanceof Array){this.x = x[0]; this.y = x[1];}
					else if(x instanceof Vector){this.x = x.x; this.y = x.y}
				break;
			default: this.x = 0; this.y = 0; break;
		}
		if(arguments.length==2){this.x = x; this.y = y;}
	}
	$.extend(Vector, {
		scalarProd: function(v1, v2){return v1.x*v2.x + v1.y*v2.y;}
	});
	$.extend(Vector.prototype, {
		Add: function(x, y){
			if(x instanceof Array){this.x+=x[0]; this.y+=x[1];}
			else if(x instanceof Vector){this.x+=x.x; this.y+=x.y;}
			else{this.x+=x; this.y+=y;}
			return this;
		},
		add: function(x, y){return (new Vector(this)).Add(x, y);},
		Mul: function(rate){
			if(rate instanceof Vector){
				this.x*=rate.x; this.y*=rate.y;
			}
			else {
				this.x*=rate;this.y*=rate;
			}
			return this;
		},
		mul: function(rate){return (new Vector(this)).Mul(rate);},
		Norm: function(){var _=this;
			var lng = Math.sqrt(_.x*_.x+_.y*_.y);
			return _.Mul(1/lng);
		},
		norm: function(){
			return (new Vector(this)).Norm();
		},
		getAngle: function(degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			var angle = Math.atan2(this.y, this.x);
			return degreeMode?angle/Math.PI*180:angle;
		},
		getLength: function(){return Math.sqrt(this.x*this.x + this.y*this.y);},
		getPolar: function(degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			return {
				mod:this.getLength(), 
				angle:this.getAngle(degreeMode)
			};
		},
		Set: function(x, y){
			if(arguments.length==1){
				if(x instanceof Array){this.x = x[0]; this.y = x[1];}
				else if(x instanceof Vector){this.x = x.x; this.y = x.y}
			}
			else{
				this.x = x; this.y = y;
			}
			return this;
		},
		SetPolar: function(mod, angle, degreeMode){
			degreeMode = degreeMode==null?true:degreeMode;
			if(degreeMode) angle = angle/180*Math.PI;
			this.x = Math.cos(angle)*mod;
			this.y = Math.sin(angle)*mod;
			return this;
		},
		toString: function(){
			return "("+[this.x, this.y].join()+")";
		}
	});

	
	function knob(x, y, range, lblCount, title, onchange){
		var size = 20, color = "#999",
			pos0 = 90,
			marg = 40;
			
		function angle(x2, y2){
			return new Vector(x, y).Mul(-1).Add(x2, y2).getAngle(true) - pos0 - marg;
		}
		
		var drag = {
			start: function(x2, y2, e){
				x2-=panelPos.left; y2-=panelPos.top;
				this.attr({fill:"#777"});
				this.data("curPos", new Vector(x, y).Mul(-1).Add(x2, y2));
			},
			move: function(dx, dy, x1, y1, e){
				var pos = this.data("curPos");
				if(!pos) return;
				var pos1 = pos.add(dx, dy);
				// console.log(dx, dy, pos, pos1);
				//this.data("curPos", pos);
				var angle = pos1.getAngle(true) - pos0 - marg;
				angle = Math.abs(angle)%360;
				// if(angle<0) angle = 0;
				// else if(angle>360-marg*2) angle = 360-marg*2;
				console.log(angle);
				direction.SetPolar(size*.7, angle, true);
				marker.attr({cx:x+direction.x, cy:y+direction.y});
				//onchange(range.mn+(360-marg*2)*pos/(range.mx-range.mn));
			},
			end: function(e){
				this.attr({fill:color})
			}
		};
		
		paper.circle(x, y, 20).attr({fill:"#999", cursor:"pointer"}).drag(drag.move, drag.start, drag.end);
		var direction = new Vector().SetPolar(size*.7, pos0+marg, true);
		var marker = paper.circle(x+direction.x, y+direction.y, 3).attr({fill:"#0f0", stroke:0});
		
		paper.text(x, y+size*2.4, title.toUpperCase()).attr({"font-size":12});
		
		for(var i=0,stV=(360-marg*2)/lblCount,lblDir=new Vector(), lblV=range.mn, lblSt=(range.mx-range.mn)/lblCount; i<=lblCount; i++){
			lblDir.SetPolar(size*1.3, pos0+marg+stV*i, true);
			paper.circle(x+lblDir.x, y+lblDir.y, 2).attr({fill:"#444", stroke:0});
			lblDir.Mul(1.5);
			paper.text(x+lblDir.x, y+lblDir.y, ((lblV+lblSt*i)+"").substr(0,3)/*.match(/^[0-9\.]([0-9\.][0-9\.])?/i)*/);
		}
	}
	
	function init(pnl){
		panelPos = pnl.offset();
		
		paper = $R(pnl.css({width:size.w, height:size.h})[0]);
		paper.rect(0, 0, size.w, size.h).attr({fill:"#ccc", stroke:"#888"});
		
		knob(100, 400, {mn:0, mx:1}, 10, "Threshold", function(v){
			console.log(v);
		});
		knob(250, 400, {mn:1, mx:10}, 9, "Rate", function(v){
			console.log(v);
		});
		knob(400, 400, {mn:0, mx:10}, 10, "Volume", function(v){
			console.log(v);
		});
		//paper.circle(100, 400, 3).attr({fill:"#f00"});
	}
	
	$.fn.compressor = function(){
		$(this).each(function(i,el){
			init($(el));
		});
	};
})(jQuery, Html, Raphael);