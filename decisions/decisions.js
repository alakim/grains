if(typeof(Html)=="undefined") alert("html.js module required!");

function abstractNode(argList, inst){
	argList = argList[0];
	inst.type = "decision";
	inst.text = argList[0];
	inst.children = [];
	for(var i=1; i<argList.length; i++){
		var el = argList[i];
		inst.children.push(el);
		el.parent = inst;
	}
}

function Decision(){
	function c(){
		abstractNode(arguments, this);
	}
	c.prototype = {
		render: function(){with(Html){
			return div(
				h1(this.text),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	Decision.instance = new c(arguments);
}

function Problem(){
	function c(){
		abstractNode(arguments, this);
	}
	
	c.prototype = {
		render: function(){with(Html){
			return div({style:"border-left:3px solid #aaaaaa; padding:3px; margin:3px; margin-left:10px;"},
				p(this.text),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	
	return new c(arguments);
}

function Solution(){
	function c(){
		abstractNode(arguments, this);
	}
	
	c.prototype = {
		render: function(){with(Html){
			return div({style:"border-left:3px solid #aaaaaa; padding:3px; margin:3px; margin-left:10px;"},
				p(this.text),
				apply(this.children, function(chld){
					return chld.render();
				})
			);
		}}
	};
	
	return new c(arguments);
}

function Description(){
	function c(){
		abstractNode(arguments, this);
	}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"font-size:12px; font-family:Times new roman, serif; font-style:italic; margin-left:20px;"}, this.text);
		}}
	};
	
	return new c(arguments);
}

function Advantage(){
	function c(){
		abstractNode(arguments, this);
	}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"margin-left:10px;"},
				span({style:"font-size:25px; color:#008800;"}, "+ "), 
				this.text
			);
		}}
	};
	
	return new c(arguments);
}

function Disadvantage(){
	function c(){
		abstractNode(arguments, this);
	}
	
	c.prototype = {
		render: function(){with(Html){
			return p({style:"margin-left:10px;"},
				span({style:"font-size:25px; color:#880000;"}, "- "), 
				this.text
			);
		}}
	};
	
	return new c(arguments);
}

(function(){

	function extend(o,s){for(var k in s){o[k]=s[k];}}
	
	function addEventHandler(element, event, handler){
		if(element.addEventListener)
			element.addEventListener(event, handler, true);
		else
			element.attachEvent("on"+event, handler);
	}
	
	extend(Decision, {
		init: function(){
			document.body.innerHTML = Decision.instance.render();
		}
	});
	
	addEventHandler(window, "load", function(){Decision.init()});
}());


