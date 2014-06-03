(function(){

	function jcssDef(){
		function each(coll, F){
			if(!coll) return;
			if(coll.length)
				for(var i=0; i<coll.length;i++) F(coll[i], i);
			else
				for(var k in coll) F(coll[k], k);
		}
		function tag(name, content, selfClosing, notEmpty){
			var h = [];
			var a = [];
			each(content, function(el){
				if(typeof(el)!="object")
					h.push(el);
				else{
					each(el, function(val, nm){
						a.push(" "+nm+"=\""+val+"\"");
					});
				}
			});
			
			h = h.join("");
			if(h.match(/^\s+$/i))
				h = "";
			if(notEmpty && h.length==0)
				h = "&nbsp;";
			
			if(selfClosing && h.length==0)
				return "<"+name+a.join("")+(Html.xhtmlMode? "/>":">");
			else
				return "<"+name+a.join("")+">"+h+"</"+name+">";
		}
		function sizeProperty(name){
			return function(val){
				if(typeof(val)=="number" || (typeof(val)=="string" && val.match(/^\d+$/))) val+="px";
				return name+":"+val;
			};
		}
		function borderProperty(side){
			return function(style){
				return "border"+(side?("-"+side):"")+":"+style;
			}
		}
		return {
			version: "1.3",
			cssRef: function(ref){
				var head = document.head || document.getElementsByTagName('head')[0],
					style = document.createElement('link'),
					attRef = document.createAttribute("href"),
					attRel = document.createAttribute("rel");

				style.type = "text/css";
				attRef.nodeValue = ref; style.setAttributeNode(attRef);
				attRel.nodeValue = "stylesheet"; style.setAttributeNode(attRel);
				
				head.appendChild(style);
				return style;
			},
			stylesheet: function(css){
				if(css instanceof Array) css = css.join("\n");
				
				var head = document.head || document.getElementsByTagName('head')[0],
					style = document.createElement('style');

				style.type = 'text/css';
				if (style.styleSheet)
					style.styleSheet.cssText = css;
				else
					style.appendChild(document.createTextNode(css));

				var styles = document.getElementsByTagName("LINK");
				var firstLink;
				for(var i=0; firstLink=styles[i],i<styles.length; i++){
					if(firstLink.rel=="stylesheet") break;
				}
				head.insertBefore(style, firstLink);
				//head.appendChild(style);
				
				return style;
			},
			rule: function(selector, styles){
				if(styles instanceof Array) styles = styles.join(";\n\t");
				return selector+"{\n\t"+styles+"\n}";
			},
			inside: function(selector, rules){
				for(var r,i=0; r=rules[i],i<rules.length; i++){
					rules[i] = selector+" "+r;
				}
				return rules.join("\n");
			},
			width: sizeProperty("width"),
			height: sizeProperty("height"),
			top: sizeProperty("top"),
			left: sizeProperty("left"),
			
			margin: sizeProperty("margin"),
			marginL: sizeProperty("margin-left"),
			marginR: sizeProperty("margin-right"),
			marginT: sizeProperty("margin-top"),
			marginB: sizeProperty("margin-bottom"),
			
			padding: sizeProperty("padding"),
			paddingL: sizeProperty("padding-left"),
			paddingR: sizeProperty("padding-right"),
			paddingT: sizeProperty("padding-top"),
			paddingB: sizeProperty("padding-bottom"),
			
			border: borderProperty(),
			borderL: borderProperty("left"),
			borderR: borderProperty("right"),
			borderT: borderProperty("top"),
			borderB: borderProperty("bottom"),
			
			color: function(clr){return "color:"+clr},
			bColor: function(clr){return "background-color:"+clr},
			
			pointer: function(){return "cursor:pointer";},
			
			underline: function(v){return "text-decoration:"+(v || v==null?"underline":"none");},
			italic: function(v){return "font-style:"+(v || v==null?"italic":"normal");},
			bold: function(v){return "font-weight:"+(v || v==null?"bold":"normal");},
			
			textL: function(){return "text-align:left";},
			textR: function(){return "text-align:right";},
			textC: function(){return "text-align:center";},
			
			indent: sizeProperty("text-indent"),
			
			floatL: function(){return "float:left";},
			floatR: function(){return "float:right";},
			
			fSize: sizeProperty("font-size"),
			font: function(family, size){
				if(typeof(size)=="number" || (typeof(size)=="string" && size.match(/^\d+$/))) size+="px";
				var style = "font-family:"+family;
				if(size) style+=";\n\tfont-size:"+size;
				return style;
			}
		};
	}
	
	if(typeof(define)=="function")
		define([], jcssDef);
	else
		JCSS = jcssDef();

})();