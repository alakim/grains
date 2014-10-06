var Menu = (function($, H){
	var target, menuData, debugMode;
	
	var templates = {
		main: function(data, parent){with(H){
			return ul(
				apply(data, function(itm, i){
					return itm?li(
						itm.id?a(((!target && !parent && i==0)||(target && itm.id==target.id && target.sect==""))?{"class":"current"}:null,
							{href:"?"+(debugMode?"debug&":"")+"p="+itm.id}, itm.title
						):span(itm.title),
						
						itm.sub?(itm.id?templates.submenu(itm.id, itm.sub):templates.main(itm.sub, itm))
							:null
					):null;
				})
			);
		}},
		submenu: function(fileID, data){with(H){
			return data?ul(
				apply(data, function(itm){
					return itm?li(
						a((target && fileID==target.id && itm.id==target.sect)?{"class":"current"}:null,
							{href:"?"+(debugMode?"debug&":"")+"p="+fileID+"#"+itm.id}, itm.title
						),
						itm.sub?templates.submenu(fileID, itm.sub):null
					):null;
				})
			):null;
		}}
	};
	
	function rebuild(){
		debugMode = document.location.search.match(/[\&\?]debug/i);
		setTimeout(function(){
			var mt = document.location.search.match(/p=([^&]+)/);
			if(mt){
				target = {id:mt[1], sect:document.location.hash.slice(1)};
				//console.log(target);
			}
			$("#menuPnl").html(templates.main(menuData))
				.find("a").click(rebuild);
		}, 100);
	}
	
	function MenuDef(data){
		menuData = data;
		rebuild();
	}
	
	return MenuDef;
})(jQuery, Html);