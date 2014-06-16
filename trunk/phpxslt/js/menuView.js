var Menu = (function($, H){
	var target, menuData;
	
	var templates = {
		main: function(data){with(H){
			return ul(
				apply(data, function(itm){
					return itm?li(
						itm.id?a((itm.id==target.id && target.sect=="")?{"class":"current"}:null,
							{href:"?p="+itm.id}, itm.title
						):span(itm.title),
						itm.sub?(itm.id?templates.submenu(itm.id, itm.sub):templates.main(itm.sub))
							:null
					):null;
				})
			);
		}},
		submenu: function(fileID, data){with(H){
			return data?ul(
				apply(data, function(itm){
					return itm?li(
						a((fileID==target.id && itm.id==target.sect)?{"class":"current"}:null,
							{href:"?p="+fileID+"#"+itm.id}, itm.title
						),
						itm.sub?templates.submenu(fileID, itm.sub):null
					):null;
				})
			):null;
		}}
	};
	
	function rebuild(){
		setTimeout(function(){
			target = {id:document.location.search.slice(3), sect:document.location.hash.slice(1)};
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