if(typeof(Html)=="undefined") alert("html.js module required!");

function abstractNode(argList, inst, type){
	argList = argList[0];
	inst.type = type;
	inst.content = argList[0];
	inst.children = [];
	for(var i=1; i<argList.length; i++){
		var el = argList[i];
		inst.children.push(el);
		el.parent = inst;
	}
}

var stdBorderStyle = "border:1px solid #aaaaaa; border-left-width:3px; padding:3px; margin:3px; margin-left:10px;";

function Icon(text, size, bgColor, color){
	bgColor = bgColor?bgColor:"#ffffff";
	color = color?color:"#000000";
	size = size?size:25;
	return Html.span({style:"font-size:"+size+"px; padding:3px; margin:3px; background-color:"+bgColor+"; color:"+color+";"}, text);
}

function Decision(){
	function c(){abstractNode(arguments, this, "decision");}
	
	c.prototype = {
		render: function(){with(Html){
			return div(
				h1(this.content),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	
	Decision.instance = new c(arguments);
}

function Problem(){
	function c(){abstractNode(arguments, this, "problem");}
	
	c.prototype = {
		render: function(){with(Html){
			return div({style:stdBorderStyle},
				p(
					Icon("?", 32, "#ffaa88", "#ff0000"),
					this.content
				),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	
	return new c(arguments);
}

function Solution(){
	function c(){abstractNode(arguments, this, "solution");}
	
	c.prototype = {
		render: function(){with(Html){
			return div({style:stdBorderStyle},
				p(
					Icon("!", 32, "#aa88ff", "#00ff00"),
					this.content
				),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	
	return new c(arguments);
}

function Description(){
	function c(){abstractNode(arguments, this, "description");}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"font-size:12px; font-family:Times new roman, serif; font-style:italic; margin-left:20px;"}, this.content);
		}}
	};
	
	return new c(arguments);
}

function Advantage(){
	function c(){abstractNode(arguments, this, "advantage");}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"margin-left:10px;"},
				Icon("+", 15, "#00ff00", "#008800"),
				this.content
			);
		}}
	};
	
	return new c(arguments);
}

function Disadvantage(){
	function c(){abstractNode(arguments, this, "disadvantage");}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"margin-left:10px;"},
				Icon("-", 15, "#ff0000", "#880000"),
				this.content
			);
		}}
	};
	
	return new c(arguments);
}

(function(){
	
	function addEventHandler(element, event, handler){
		if(element.addEventListener)
			element.addEventListener(event, handler, true);
		else
			element.attachEvent("on"+event, handler);
	}
	
	addEventHandler(window, "load", function(){
		document.body.innerHTML = Decision.instance.render();
	});
}());


