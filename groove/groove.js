var Groove = (function($,$H){
	var grooves = [],
		sorted = [];
	
	var scaleBes = {
		C:"D",
		Des:"Es",
		D:"E",
		Es:"F",
		E:"Fis",
		F:"G",
		Fis:"Gis",
		G:"A",
		Gis:"Bes",
		A:"B",
		Bes:"C",
		B:"Cis"
	};
	
	function getBes(key){
		if(!key) return;
		var kk = key.split(" ");
		return scaleBes[kk[0]]+" "+kk[1];
	}
	
	function Groove(title, key, sections, href){
		this.idx = grooves.length;
		this.title = title;
		this.key = key;
		this.sections = sections;
		this.href = href;
		grooves.push(this);
		sorted.push({idx:this.idx, title:title});
	}
	
	var templates = {
		main: function(gr){with($H){
			return div(
				table({border:0}, tr( td(
					templates.menu(),
					apply(sorted, function(g){
						return templates.groove(grooves[g.idx]);
					})
				)))
			);
		}},
		menu: function(){with($H){
			return div(
				a({name:"toc"}),
				ul(
					apply(sorted, function(g){
						var gr = grooves[g.idx];
						return li(
							a({href:"#"+gr.idx}, gr.title)
						);
					})
				)
			);
		}},
		groove: function(gr){with($H){
			return div({"class":"groove"},
				a({name:gr.idx}),
				h2(gr.title),
				div(a({href:"#toc"}, "to TOC")),
				p(gr.key, " (Bes: ", getBes(gr.key),")"),
				gr.href?p(a({href:gr.href, target:"_blank"}, "sheet music")):null,
				table({border:0, cellpadding:3, cellspacing:6},
					tr(
						apply(gr.sections, function(sect, nm){
							return th(nm);
						})
					),
					tr(
						apply(gr.sections, function(sect){
							return td({"class":"section"},
								templates.section(sect)
							);
						})
					)
				)
			);
		}},
		section: function(sect){with($H){
			var bars = sect.split(";"),
				groups = [];
			for(var i=0,bar; bar=bars[i],i<bars.length; i++){
				if(bar=="*") bars[i] = bars[i-1];
				if(i%2){
					groups.push([bars[i-1], bars[i]]);
				}
			}
			
			return table({border:0, cellpadding:3, cellspacing:0},
				apply(groups, function(grp, i){
					return markup(
						i<1||(i%2)?null:tr(td({colspan:2, "class":"space"})),
						tr(
							td({"class":"bar"}, grp[0]),
							td({"class":"bar"}, grp[1])
						)
					);
				})
			);
		}}
	};
	
	
	$(function(){
		sorted.sort(function(a, b){
			return a.title==b.title?0:a.title<b.title?-1:1;
		});

		$("body").append(
			templates.main()
		);
		$("body td.space").html("");
	});
	
	return Groove;
})(jQuery, Html);