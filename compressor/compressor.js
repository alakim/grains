(function($, $H, $R){
	var size = {w:510, h:550};
	var panelPos;
	var paper;
	
	var threshold = .7, rate = 3, volume = 1;
	
	var Vector = (function(){
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
		return Vector;
	})();

	
	function knob(x, y, range, lblCount, title, onchange, defVal){
		if(defVal==null) defVal = range.mn;
		
		var size = 30, 
			pos0 = 90,
			marg = 40;
			
		function angle(x2, y2){
			return new Vector(x, y).Mul(-1).Add(x2, y2).getAngle(true) - pos0 - marg;
		}
		
		var drag = {
			start: function(x2, y2, e){
				x2-=panelPos.left; y2-=panelPos.top;
				this.attr({fill:grad2});
				this.data("curPos", new Vector(x, y).Mul(-1).Add(x2, y2));
			},
			move: function(dx, dy, x1, y1, e){
				var pos = this.data("curPos");
				if(!pos) return;
				var pos1 = pos.add(dx, dy);
				
				var angle = pos1.getAngle(true) - pos0 - marg;
				if(angle<0) angle += 360;
				if(angle>320) angle = 0;
				if(angle>360-marg*2) angle = 360-marg*2;
				
				direction.SetPolar(size*.7, angle + pos0 + marg, true);
				marker.attr({cx:x+direction.x, cy:y+direction.y});
				onchange(range.mn+(range.mx-range.mn)*angle/(360-marg*2));
			},
			end: function(e){
				this.attr({fill:grad})
			}
		};
		
		var grad = "r(0.25, 0.25)#ccc-#888", 
			grad2 = "r(0.25, 0.25)#aaa-#777";
		paper.circle(x, y, size).attr({fill:grad, cursor:"pointer"}).drag(drag.move, drag.start, drag.end);
		var defAngle = pos0+marg + (360-marg*2)*(defVal-range.mn)/(range.mx-range.mn);
		var direction = new Vector().SetPolar(size*.7, /*pos0+marg*/ defAngle, true);
		var marker = paper.circle(x+direction.x, y+direction.y, 3).attr({fill:"#0f0", stroke:0});
		
		paper.text(x, y+size+30, title.toUpperCase()).attr({"font-size":12});
		
		for(var i=0,stV=(360-marg*2)/lblCount,lblDir=new Vector(), lblV=range.mn, lblSt=(range.mx-range.mn)/lblCount; i<=lblCount; i++){
			lblDir.SetPolar(size+10, pos0+marg+stV*i, true);
			paper.circle(x+lblDir.x, y+lblDir.y, 2).attr({fill:"#444", stroke:0});
			lblDir.SetPolar(size+23, pos0+marg+stV*i, true);
			paper.text(x+lblDir.x, y+lblDir.y, ((lblV+lblSt*i)+"").substr(0,3)/*.match(/^[0-9\.]([0-9\.][0-9\.])?/i)*/);
		}
	}
	
	function curveFunc(x){
		return x<threshold?x*volume
			:(threshold+(x-threshold)/rate)*volume;  //(x+(1-threshold)/rate)*volume;
	}
	
	var histogram = [
		0, 0, 0, 0, 0,
		0, 0, 0, 0, 3,
		5, 5, 8, 9, 11,
		15, 16, 11, 6, 1
	];
	
	function displayCtrl(x, y, w){var h = w;
		paper.rect(x, y, w, h).attr({fill:"90-#222-#000"});
		
		function getCurvePath(){
			var yk = curveFunc(threshold),
				ym = curveFunc(1);
			return ["M", x, y+h, "L", x+h*threshold, y+h*(1-yk), "L", x+w, y+h*(1-ym)];
		}
		
		var curve = paper.path(getCurvePath()).attr({stroke:"#afa", "stroke-width":2});
		
		function hHist(i){
			return y+h-h*(curveFunc((i+1)/histogram.length));
		}
		var xHistCtrl = [];
		var yHistCtrl = [];
		var histRate = 2;
		for(var i=0; i<histogram.length; i++){
			xHistCtrl[i] = paper.rect(x+i*w/histogram.length, y+h-histogram[i]*histRate, w/histogram.length, histogram[i]*histRate).attr({fill:"#aa8"});
			yHistCtrl[i] = paper.rect(x, hHist(i), histogram[i]*histRate, h/histogram.length).attr({fill:"#aa8"});
		}
		
		paper.text(x+w-70, y+h+25, "амплитуда входного сигнала").attr({"text-anchor":"right"});
		paper.text(x-32, y+80, "амплитуда выходного сигнала").attr({"text-anchor":"right", transform:"r-90"});
		
		var grStep = w/10;
		for(var i=0; i<10; i++){
			paper.text(x+grStep*i, y+h+10, (i*.1+"").substr(0, 3));
			paper.text(x-12, y+(h-grStep*i), (i*.1+"").substr(0, 3));
		}
		paper.text(x+w, y+h+10, "1");
		paper.text(x-12, y+6, "1");
		
		return {
			update: function(){
				curve.attr({path:getCurvePath()});
				for(var i=0; i<yHistCtrl.length; i++){
					yHistCtrl[i].attr({y:hHist(i)});
				}
			}
		};
	}
	
	function init(pnl){
		panelPos = pnl.offset();
		
		paper = $R(pnl.css({width:size.w, height:size.h})[0]);
		paper.rect(0, 0, size.w, size.h).attr({fill:"#ddd", stroke:"#888"});
		paper.rect(1, 35, size.w-2, size.h-36).attr({fill:"90-#aaa-#ddd", stroke:0});
		
		var display = displayCtrl(100, 30, 300);
		paper.rect(1, 1, size.w-2, 30).attr({fill:"#ddd", stroke:0});
		
		var knobY = 450;
		knob(100, knobY, {mn:0, mx:1}, 10, "Threshold", function(v){
			threshold = v;
			display.update();
		}, threshold);
		knob(250, knobY, {mn:1, mx:10}, 9, "Ratio", function(v){
			rate = v;
			display.update();
		}, rate);
		knob(400, knobY, {mn:1, mx:4}, 10, "Volume", function(v){
			volume = v;
			display.update();
		}, volume);
	}
	
	$.fn.compressor = function(){
		$(this).each(function(i,el){
			init($(el));
		});
	};
})(jQuery, Html, Raphael);