(function($,$H){
	var size = {w:400, h:300};
	
	if(!$.fn.control){
		$.fn.control = function(constr, x, y, z){
			$(this).each(function(i, el){
				constr($(el), x, y, z);
			});
			return this;
		};
	}
	
	function parseDate(dd){
		if(!(dd&&dd.length)) return new Date();
		var mt = dd.match(/(\d\d?)\.(\d\d?)\.(\d\d\d\d)/i);
		var y = +mt[3],
			m = parseInt(mt[2], 10) - 1,
			d = parseInt(mt[1], 10);
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
	
	function formatDate(dd, digitalMode){
		var d = dd.getDate(), m = dd.getMonth()+1, y = dd.getYear()+1900;
		return digitalMode?[d<10?"0"+d:d, m<10?"0"+m:m, y].join(".")
			:[d, months.G[m-1], y , " г."].join(" ");
	}
	
	function DaysTable(pnl, date, field){
		pnl.html("");
		var margin = 3,
			headerH = $(".calendarDlg .monthPnl").height() 
						+ $(".calendarDlg .daysPnl").height();
		
		var btnSize = {w:size.w/7-margin, h:(size.h - headerH)/5-margin*5};
		//console.log(btnSize);
		var dateMonth = date.getMonth();
		var dd = new Date(date);
		dd.setDate(1);
		//dd.setMonth(3);
		var curMonth = dd.getMonth(),
			day1 = dd.getDay();
			if(day1==0) day1 = 7;
		//console.log(day1);
		//console.log(day, dd, dd.getDay());
		for(i=1; dd.setDate(i),i<=31&&dd.getMonth()==curMonth; i++){
			var day = day1+i-2;
			var pdTop = 3;
			var btn = $($H.div(
				{"class":"calendBtn", style:$H.style({
					width: btnSize.w, height:btnSize.h-pdTop,
					top: 30+headerH+margin+(Math.floor((day)/7)*(btnSize.h+margin)), 
					left:day%7*(btnSize.w+margin),
					"padding-top":pdTop+"px"
				})},
				i
			));
			pnl.append(btn);
			btn.click(function(){
				var d = +$(this).html()
				//console.log(nr);
				date.setDate(d);
				field.val(formatDate(date, true));
				hideDialog();
			});
			if(i==date.getDate() && dd.getMonth()==dateMonth) btn.addClass("current");
			if(day%7==6) btn.addClass("weekend");
		}
	}
	
	function MonthPanel(pnl, date, field){
		//console.log(date);

		function incDate(di){
			var d2 = new Date(date);
			d2.setMonth(date.getMonth()+di);
			$(".calendarDlg .calendDaysTable").control(DaysTable, d2, field);
			$(".calendarDlg .monthPnl").control(MonthPanel, d2, field);
		}
		
		pnl.html((function(){with($H){
			return div(
				div({"class":"button btnMonthBk"}, "&lt;"),
				div({style:style({width:size.w*.7})},
					months.N[date.getMonth()], " ",
					date.getYear()+1900, " г."
				),
				div({"class":"button btnMonthFr"}, "&gt;")
			);
		}})())
		.find(".btnMonthBk").click(function(){incDate(-1);}).end()
		.find(".btnMonthFr").click(function(){incDate(1);}).end();
	}
	
	function DaysPanel(pnl){
		var days = "Пн,Вт,Ср,Чт,Пт,Сб,Вс".split(",");
		var ww = ($(".calendarDlg").width()-5)/7;
		pnl.html((function(){with($H){
			return div(
				apply(days, function(d){
					return div({style:style({width:ww, "text-align":"center"})}, d);
				})
			);
		}})());
	}
	
	function Calendar(pnl, field){
		var val = field.val(),
			date = parseDate(val);
		
		pnl.html((function(){with($H){
			return div(
				div({"class":"header"}, formatDate(date, false)),
				div({"class":"monthPnl"}),
				div({"class":"daysPnl"}),
				div({"class":"calendDaysTable", style:style({height:size.h*.8})}),
				div({style:"margin:"+(size.h*0)+"px "+(size.w/2-30)+"px;"},
					input({type:"button", value:"Закрыть", "class":"btCancel"})
				)
			);
		}})())
		.find(".btCancel").click(function(){
			hideDialog();
		}).end()
		.find(".monthPnl").control(MonthPanel, date, field).end()
		.find(".calendDaysTable").control(DaysTable, date, field).end()
		.find(".daysPnl").control(DaysPanel).end();
	}
	
	function hideDialog(){
		$(".calendarDlg").hide();
		$(".calendarDlgShild").hide();
	}
	function showDialog(fld){
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
			top:$("body").height()/2+size.h - 200,
			left:$("body").width()/2-size.w
		}).control(Calendar, fld).show();
	}
	
	function CalendarField(fld){
		fld.attr({readonly:true})
			.css({cursor:"pointer"})
			.click(function(){
				showDialog(fld);
			});
	}
	
	$.fn.calendar = function(){
		$(this).control(CalendarField);
	};

})(jQuery, Html);