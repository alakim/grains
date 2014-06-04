var Menu = (function($, H){
	var templates = {
		main: function(data){with(H){
			return ul(
				apply(data, function(itm){
					return itm?li(
						a({href:"?p="+itm.id}, itm.title),
						itm.sub?templates.submenu(itm.id, itm.sub):null
					):null;
				})
			);
		}},
		submenu: function(fileID, data){with(H){
			return data?ul(
				apply(data, function(itm){
					return itm?li(
						a({href:"?p="+fileID+"#"+itm.id}, itm.title),
						itm.sub?templates.submenu(fileID, itm.sub):null
					):null;
				})
			):null;
		}}
	};
	
	function MenuDef(data){
		$("#menuPnl").html(templates.main(data));
	}
	
	return MenuDef;
})(jQuery, Html);