
function ShowPhoto(src, title, alt){var _=ShowPhoto;
	alt = alt?alt:"";
	var photo = new Image();
	photo.src = src;
	_.images[src] = photo;
	var minSz = DWL.minSize;
	DWL.minSize.h = 10;
	var margin = _.margins[_.clientType()];
	var initSize = {
		w:280+margin.w,
		h:14+margin.h
	}
	var dlg = DWL.open(null, title, "width="+initSize.w+",height="+initSize.h+",left=10,top=10,resize=0,scrolling=0,pinButton=1");
	DWL.minSize = minSz;
	dlg.contentarea.innerHTML = "<img src=\""+(DWL.__.images.progressbar.src)+"\">";
	var count = _.waitTimeout/_.pollingTimeout;
	window.setTimeout(function(){_.display(src, title, alt, dlg, count);}, 50);
};

ShowPhoto.extend = function(s){for(var k in s){ShowPhoto[k] = s[k];}};

ShowPhoto.extend({
	version: "1.5.94",
	maxHeight: 750,
	pollingTimeout:200,
	waitTimeout:60000,
	margins:{
		ff:{w:5, h:0},
		ie:{w:8, h:5},
		opera:{w:5, h:0},
		unknown:{w:5, h:0}
	},
	
	clientType: function(){
		if(navigator.appName.match(/internet\s+explorer/i))
			return "ie";
		if(navigator.appName.match(/Netscape/i))
			return "ff";
		if(navigator.appName.match(/opera/i))
			return "opera";
		return "unknown";
	},

	images:{},
	
	display: function(src, title, alt, dlg, count){var _=ShowPhoto;
		var photo = _.images[src];
		if(photo.complete)
			_.openDialog(src, title, alt, dlg);
		else if(count>0)
			window.setTimeout(function(){_.display(src, title, alt, dlg, count - 1);}, _.pollingTimeout);
	},
	
	openDialog: function(src, title, alt, dlg){var _=ShowPhoto;
		alt = alt.length?alt:title;
		var photo = _.images[src];
		var client = _.clientType();
		var sz = {w:photo.width + _.margins[client].w, h:photo.height + _.margins[client].h};
		var useScrolling = false;
		if(sz.h>_.maxHeight){
			sz.h = _.maxHeight;
			sz.w += 20;
			useScrolling = true;
		}
		
		
		dlg.contentarea.innerHTML = "<img src=\""+src+"\" title=\""+alt+"\" alt=\""+alt+"\">";
		DWL.setSize(dlg, sz.w, sz.h);
		if(useScrolling){
			dlg.isScrollable(true);
		}
	}
});
