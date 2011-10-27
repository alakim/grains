if(typeof($)!="function") alert("jquery.js module required!");
if(typeof(Raphael)!="function") alert("raphael.js module required!");

var AniPanel = (function(){
	var version = "1.0.0";
	var showBorders = false;
	function extend(o,s){for(var k in s){o[k] = s[k]}}
	
	function traceObject(o){
		if(typeof(console.log)=="function"){
			console.log(o);
		}
		else{
			var s = [];
			for(var k in o)
				s.push(k+": "+o[k]);
			alert(s.join("\n"));
		}
	}
	
	function __(pnl){var _=this;
		if(typeof(pnl)=="string")
			pnl = document.getElementById(pnl);
		_.panel = $(pnl);
		
		_.size = {
			x: parseInt(_.panel.css("left")),
			y: parseInt(_.panel.css("top")),
			w: _.panel.width(),
			h: _.panel.height()
		};
		
		build(_);
	}
	
	var frames = [];
	
	function buildFrame(pnl){
		var frmID = "AniPanelFrm"+frames.length;
		$("body").append("<div id=\""+frmID+"\"></div>");
		var borderWidth = __.corners;
		var borderWidth2 = borderWidth*1.5;
		var padding = 2;
		var styles = {
			position: "absolute",
			"z-index": __.zIndex,
			border: showBorders?"1px solid #aaf":0,
			left: (pnl.size.x-borderWidth/2-padding)+"px", top: (pnl.size.y-borderWidth/2-padding)+"px",
			width: pnl.w+borderWidth2 + padding+__.shadow.offset, height: pnl.h+borderWidth2 + padding+__.shadow.offset
		};
		$("#"+frmID).css(styles);
		
		
		var frm = Raphael(document.getElementById(frmID), pnl.size.w + borderWidth2+__.shadow.offset, pnl.size.h + borderWidth2+__.shadow.offset);
		frames.push(frm);
		pnl.frame = frm;
		pnl.frameID = frmID;
		
		frm.rect(padding+__.shadow.offset, padding+__.shadow.offset, 
			pnl.size.w + borderWidth2-padding*2-2, pnl.size.h + borderWidth2-padding*2-2, 
			__.corners)
			.attr({
				// fill: "#fff",
				stroke: 0
			})
			.glow({width:__.shadow.width, color:__.shadow.color});
		
		frm.rect(padding, padding, pnl.size.w + borderWidth2-padding*2, pnl.size.h + borderWidth2-padding*2, __.corners).attr({
			fill: "#fff",
			stroke: "#888"
		})
	}
	
	function build(_){
		_.panel.css({
			position: "absolute",
			border: showBorders?"1px solid #faa":0,
			"background-color": __.fill,
			"z-index": __.zIndex+1
		});
		buildFrame(_);
	}
	
	__.prototype = {
		show: function(){
			this.panel.show();
			$("#"+this.frameID).show();
		},
		
		hide: function(){
			$("#"+this.frameID).hide();
			this.panel.hide();
		}
	};
	
	extend(__,{
		version: version,
		corners: 8,
		shadow: {width:10, color:"#888", offset:4},
		zIndex: 100,
		fill: "#fff"
	});
	
	return __;
})();