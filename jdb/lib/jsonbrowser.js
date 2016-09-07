var JsonBrowser = (function($, $D, $H){
	var px = Html.unit("px");
	Html.writeStylesheet({
		body:{
			"font-family":"Verdana, Arial, Sans-Serif",
			"font-size":px(16),
			" * ":{ // disable font boosting
				"max-height": "1000000em", // Chrome for Android
				"-moz-text-size-adjust": "none" // Firefox Mobile 
			},
			" .link":{
				color:"#00f",
				cursor:"pointer"
			},
			" .nodeName":{"font-weight":"bold"},
			" div.nodeName":{
				"float":"left"
			},
			" span.name":{"font-weight":"bold"},
			" .hint":{"font-size":"70%", color:"#ccc"}
		}
	});
		
	function levelView(pnl, data, level){with(Html){
		$(pnl).html((function(){with(Html){
			if(typeof(data)!="object"){
				return span(data);
			}
			var maxLevel = 2;
			level = level || 0;
			if(level==maxLevel) return;
			return ol(
				apply(data, function(el, nm){
					return li(span({"class":"nodeName"}, nm), ": ",
						el instanceof Array? markup(
							span({"class":"link lnkObj", "data-name":nm}, format("[array of {0} elements]", el.length)),
							div({"class":"pnlLevel", style:"display:none"})
						)
						:typeof(el)=="object"?markup(
							span({"class":"link lnkObj", "data-name":nm}, format("[object with {0} fields]", JDB.keys(el).length)),
							div({"class":"pnlLevel", style:"display:none"})
						)
						:el.toString()
							.replace(/&/ig, "&amp;")
							.replace(/</ig, "&lt;")
							.replace(/>/ig, "&gt;")
					);
				})
			);
		}})())
		.find(".lnkObj").click(function(){
			var pnl = $(this).parent().find(".pnlLevel");
			if(pnl.html().length){
				pnl.html("");
				pnl.fadeOut();
			}
			else{
				var nm = $(this).attr("data-name");
				levelView(pnl, data[nm]);
				pnl.fadeIn();
			}
		}).end();
	}}
	
	return {
		init: function(pnl, data){pnl=$(pnl);
			levelView(pnl, data)
			$(".btExecQuery").prop("disabled", false).click(function(){
				var query = $("#tbQuery").val();
				//var data = DB.prototype.jsondata;
				if(query || query.length){
					var F = new Function("data", "return "+query+";");
					var res = F(data);
					//data = F(data);
					levelView(pnl, res);
					$("#tbJsonRes").val(JSON.stringify(res));
				}
			});
			$(".btTransform").prop("disabled", false).click(function(){
				var json = $("#tbJsonRes").val();
				if(!json && !json.length) json = $("#tbJson").val();
				var data = JSON.parse(json);
				var rule = $("#tbTransformRule").val();
				//rule = eval(rule);
				rule = new Function("", "return "+rule+";");
				rule = rule();
				var res = rule(data);
				$("#tbTransformRes").val(res);
				
			});
		}
	};
})(jQuery, JDB, Html)