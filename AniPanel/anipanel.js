if(typeof($)!="function") alert("jquery.js module required!");
if(typeof(Raphael)!="function") alert("raphael.js module required!");

var AniPanel = (function(){
	var version = "1.0.0";
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
	
	function __(pnl, options){var _=this;
		if(typeof(pnl)=="string")
			pnl = document.getElementById(pnl);
		_.panel = $(pnl);
		_.options = options;
		var opt = _.options.open;
		_.size = {x: opt.x, y: opt.y, w: opt.w, h:opt.h};
		
		build(_);
	}
	
	var frames = [];
	var buttons = [];
	
	function buildFrame(pnl){
		var frmID = "AniPanelFrm"+frames.length;
		$("body").append("<div id=\""+frmID+"\"></div>");
		var borderWidth = __.corners;
		var borderWidth2 = borderWidth*1.5;
		var padding = 2;
		var styles = {
			position: "absolute",
			"z-index": __.zIndex,
			border: __.showBorders?"1px solid #aaf":0,
			left: (pnl.size.x-borderWidth/2-padding)+"px", 
			top: (pnl.size.y-borderWidth/2-padding-__.title.size)+"px",
			width: pnl.w+borderWidth2 + padding+__.shadow.offset, 
			height: pnl.h+borderWidth2 + padding+__.shadow.offset+__.title.size
		};
		$("#"+frmID).css(styles);
		pnl.panel.css({
			left:pnl.size.x, top:pnl.size.y
		});
		
		
		var frm = Raphael(document.getElementById(frmID), pnl.size.w + borderWidth2+__.shadow.offset, pnl.size.h + borderWidth2+__.shadow.offset+__.title.size);
		frames.push(frm);
		pnl.frame = frm;
		pnl.frameID = frmID;
		
		frm.rect(padding+__.shadow.offset, padding+__.shadow.offset, 
			pnl.size.w + borderWidth2-padding*2-2, pnl.size.h + borderWidth2-padding*2-2+__.title.size, 
			__.corners)
			.attr({stroke: 0})
			.glow({width:__.shadow.width, color:__.shadow.color});
		
		frm.rect(padding, padding, pnl.size.w + borderWidth2-padding*2, pnl.size.h + borderWidth2-padding*2+__.title.size, __.corners).attr({
			fill: "#fff",
			stroke: "#888"
		})
		
		frm.text(pnl.size.w*0.4, __.title.size*0.7, pnl.options.open.title)
			.attr({"font-size":12});
		
		buildHideButton(pnl, frm);
	}
	
	function buildHideButton(pnl, frm){
		var x = pnl.size.w*0.9;
		var y = 5;
		var sz = 12;
		var padding = 3;
		
		function stylize(o){
			o.click(function(){pnl.hide();});
			o[0].style.cursor = "pointer";
			o[0].title = "скрыть";
		}
		var style = {stroke:"#444"};
		stylize(frm.rect(x, y, sz, sz)
			.attr({fill:"90-#888-#fff", stroke:"#aaa"}));
		stylize(frm.path(
			"M"+(x+padding)+","+(y+padding)+
			"L"+(x+sz-padding)+","+(y+sz-padding)
		).attr(style));
		stylize(frm.path(
			"M"+(x+sz-padding)+","+(y+padding)+
			"L"+(x+padding)+","+(y+sz-padding)
		).attr(style));
		
	}
	
	function buildButton(pnl){
		var opt = pnl.options.hidden;
		var btnID = "AniPanelBtn"+buttons.length;
		$("body").append("<div id=\""+btnID+"\"></div>");
		$("#"+btnID).css({
			position: "absolute",
			left: opt.x,
			top: opt.y,
			display:"none"
		});
		var btn = Raphael(document.getElementById(btnID), opt.w, opt.h);
		buttons.push(btn);
		pnl.button = btn;
		pnl.buttonID = btnID;
		
		function click(){pnl.show();}
		
		var b = btn.rect(0, 0, opt.w, opt.h, 10).attr({
			fill:"90-#888-#fff",
			stroke:"#222"
		}).click(click);
		b[0].style.cursor = "pointer";
		b = btn.text(opt.w/2, opt.h*0.60, opt.title).attr({
			fill:"#000"
		}).click(click);
		b[0].style.cursor = "pointer";
	}
	
	function build(_){
		_.panel.css({
			position: "absolute",
			border: __.showBorders?"1px solid #faa":0,
			"background-color": __.fill,
			"z-index": __.zIndex+1
		});
		buildFrame(_);
		buildButton(_);
	}
	
	__.prototype = {
		show: function(){var _=this;
			var opt = _.options;
			$("#"+_.buttonID)
				.animate({
					left:opt.open.x+opt.open.w*0.8,
					top:opt.open.y
				}, __.delay/2, function(){
					$("#"+_.buttonID).hide();
					$("#"+_.frameID).fadeIn(__.delay);
					_.panel.fadeIn(__.delay);
				});
		},
		
		hide: function(){var _=this;
			var opt = _.options;
			$("#"+_.frameID).fadeOut(__.delay);
			_.panel.fadeOut(__.delay);
			setTimeout(function(){
				$("#"+_.buttonID)
					.css({
						left:opt.open.x+opt.open.w*0.8, 
						top:opt.open.y
					})
					.show()
					.animate({
						left:opt.hidden.x,
						top:opt.hidden.y
					}, __.delay/2);
			}, __.delay/2);
		}
	};
	
	extend(__,{
		version: version,
		showBorders: false,
		corners: 8,
		shadow: {width:10, color:"#888", offset:4},
		zIndex: 100,
		title:{size:14, fill:"#444", color:"#fff"},
		fill: "#fff",
		delay:200
	});
	
	return __;
})();