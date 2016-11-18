(function($,$H){
	var size = {w:400, h:300};
	
	if(!$.fn.calendControl){
		$.fn.calendControl = function(constr, x, y, z){
			$(this).each(function(i, el){
				constr($(el), x, y, z);
			});
			return this;
		};
	}
	
	var homeDate;
	
	function parseDate(dd, xsdMode){
		xsdMode = xsdMode || false;
		if(!(dd&&dd.length)) return new Date();
		var mt = xsdMode?dd.match(/(\d\d\d\d)\-(\d\d)-(\d\d)/i)
			:dd.match(/(\d\d?)\.(\d\d?)\.(\d\d\d\d)/i);
		var y = +mt[xsdMode?1:3],
			m = parseInt(mt[2], 10) - 1,
			d = parseInt(mt[xsdMode?3:1], 10);
		var dr = new Date();
		dr.setYear(y);
		dr.setMonth(m);
		dr.setDate(d);
		return dr;
	}
	
	var months = {
		N:"январь,февраль,март,апрель,май,июнь,июль,август,сентябрь,октябрь,ноябрь,декабрь".split(","),
		G:"января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря".split(",")
	};
	
	function formatDate(dd, digitalMode, xsdMode){
		xsdMode = xsdMode || false;
		var d = dd.getDate(), m = dd.getMonth()+1, y = dd.getYear()+1900;
		return xsdMode?[y, m<10?"0"+m:m, d<10?"0"+d:d].join("-")
			:digitalMode?[d<10?"0"+d:d, m<10?"0"+m:m, y].join(".")
			:[d, months.G[m-1], y , " г."].join(" ");
	}
	
	function DaysTable(pnl, date, field, settings){
		pnl.html("");
		var margin = 3;
		var restrict = settings.restrict || function(){return false;}
		
		var btnSize = {w:size.w/7-margin, h:(size.h*.6)/5-margin*3};
		var dd = new Date(date);
		dd.setDate(1);
		var curMonth = dd.getMonth(),
			day1 = dd.getDay();
			if(day1==0) day1 = 7;
		for(i=1; dd.setDate(i),i<=31&&dd.getMonth()==curMonth; i++){
			var day = day1+i-2;
			var pdTop = 3;
			var locked = restrict(dd);
			var btn = $($H.div(
				{"class":"calendBtn"+(locked?"":" active"), style:$H.style({
					width: btnSize.w, height:btnSize.h-pdTop,
					top: margin+(Math.floor((day)/7)*(btnSize.h+margin)), 
					left:day%7*(btnSize.w+margin),
					"padding-top":pdTop+"px"
				})},
				i
			));
			pnl.append(btn);
			if(!locked) btn.click(function(){
				var d = +$(this).html()
				date.setDate(d);
				var sDD = formatDate(date, true, settings.xsdMode);
				field.val(sDD);
				hideDialog();
				if(settings.onSelect){settings.onSelect(sDD, field);}
			});
			if(date.getYear()==homeDate.getYear() && date.getMonth()==homeDate.getMonth() && i==date.getDate()) btn.addClass("current");
			if(day%7==6) btn.addClass("weekend");
		}
	}
	
	function MonthPanel(pnl, date, field, settings){
		function incDate(di){
			var d2 = new Date(date);
			d2.setMonth(date.getMonth()+di);
			$(".calendarDlg .calendDaysTable").calendControl(DaysTable, d2, field, settings);
			$(".calendarDlg .monthPnl").calendControl(MonthPanel, d2, field, settings);
			$(".calendarDlg .header").calendControl(HeaderPanel, d2, field, settings);
		}
		pnl.html((function(){with($H){
			var prevMonth = new Date(date); prevMonth.setMonth(date.getMonth()-1);
			var nextMonth = new Date(date); nextMonth.setMonth(date.getMonth()+1);
			return div(
				div({"class":"button monthBtn btnMonthBk"}, "&lt; "+months.N[prevMonth.getMonth()]),
				div({"class":"curMonth", style:style({"margin-left":80+"px", "float":"left"})},
					months.N[date.getMonth()], " ",
					date.getYear()+1900, " г."
				),
				div({"class":"button monthBtn btnMonthFr"}, months.N[nextMonth.getMonth()]+" &gt;")
			);
		}})())
		.find(".btnMonthBk").click(function(){incDate(-1);}).end()
		.find(".btnMonthFr").click(function(){incDate(1);}).end();
	}
	
	function HeaderPanel(pnl, date, field, settings){
		function incDate(di){
			var d2 = new Date(date);
			d2.setMonth(date.getMonth()+di);
			$(".calendarDlg .calendDaysTable").calendControl(DaysTable, d2, field, settings);
			$(".calendarDlg .monthPnl").calendControl(MonthPanel, d2, field, settings);
		}
		pnl.html((function(){with($H){
			return div(
				div({'class':'button btnYear'}, '&lt; ', date.getFullYear()-1),
				div({"class":"button btHome"}, formatDate(date, false)),
				div({'class':'button btnYear'}, date.getFullYear()+1, ' &gt;')
			);
		}})())
		.find('.btnYear').click(function(){
			var yr = parseInt($(this).html().match(/\d+/)[0]);
			var d = new Date();
			d.setFullYear(yr);
			$(".calendarDlg .calendDaysTable").calendControl(DaysTable, d, field, settings);
			$(".calendarDlg .monthPnl").calendControl(MonthPanel, d, field, settings);
			$(".calendarDlg .header").calendControl(HeaderPanel, d, field, settings);
		}).end();
	}
	
	
	function DaysPanel(pnl){
		var days = "Пн,Вт,Ср,Чт,Пт,Сб,Вс".split(",");
		var ww = ($(".calendarDlg").width()-5)/7;
		pnl.html((function(){with($H){
			return div(
				apply(days, function(d){
					return div({style:style({width:ww})}, d);
				})
			);
		}})());
	}
	
	function Calendar(pnl, field, settings){
		var val = field.val(),
			date = parseDate(val, settings.xsdMode);
		homeDate = date;
		
		pnl.html((function(){with($H){
			return div(
				div({"class":"header", style:style({height:size.h*.1})}),
				div({"class":"monthPnl", style:style({height:size.h*.1})}),
				div({"class":"daysPnl", style:style({height:size.h*.1})}),
				div({"class":"calendDaysTable", style:style({height:size.h*.55, position:"relative"})}),
				div(
					{style:style({
						margin:(size.h*0)+"px "+(size.w/2-30)+"px;",
						height:size.h*.1
					})},
					//input({type:"button", value:"Закрыть", "class":"btCancel"})
					span({"class":"button btCancel"}, "Отмена")
				)
			);
		}})())
		.find(".btCancel").click(function(){
			hideDialog();
			if(settings.onCancel) settings.onCancel(field);
		}).end()
		.find(".monthPnl").calendControl(MonthPanel, date, field, settings).end()
		.find(".header").calendControl(HeaderPanel, date, field, settings).end()
		.find(".calendDaysTable").calendControl(DaysTable, date, field, settings).end()
		.find(".daysPnl").calendControl(DaysPanel).end()
		.find(".btHome").click(function(){
			$(".calendarDlg .calendDaysTable").calendControl(DaysTable, homeDate, field, settings);
			$(".calendarDlg .monthPnl").calendControl(MonthPanel, homeDate, field, settings);
		}).end();
	}
	
	function hideDialog(){
		$(".calendarDlg").hide();
		$(".calendarDlgShild").hide();
	}
	function showDialog(fld, settings){
		var shild = $(".calendarDlgShild");
		if(!shild.length){
			shild = $($H.div({"class":"calendarDlgShild"}));
			$("body").append(shild);
		}
		shild.show();
		var dialog = $(".calendarDlg");
		if(!dialog.length){
			dialog = $($H.div({"class":"calendarDlg"}));
			$("body").append(dialog);
		}
		dialog.css({
			width:size.w,
			height:size.h,
			top:100, //$("body").height()/2+size.h - 200,
			left:($("body").width()-size.w)/2
		}).calendControl(Calendar, fld, settings).show();
	}
	
	function CalendarField(fld, settings){
		fld.attr({readonly:true})
			.css({cursor:"pointer"})
			.click(function(){
				showDialog(fld, settings);
				if(settings.onOpen) settings.onOpen(fld);
			});
	}
	
	$.fn.calendar = function(settings){
		if(typeof(settings)=="function") settings = {onSelect:settings};
		settings = settings || {};
		$(this).calendControl(CalendarField, settings);
	};

})(jQuery, Html);