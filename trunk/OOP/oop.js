var OOP = (function(){
	var __ = {
		version: "1.0.0",
		Inheritance: function(subClass, baseClass){
			function inheritance() { }
			inheritance.prototype = baseClass.prototype;
			
			subClass.prototype = new inheritance();
			subClass.prototype.constructor = subClass;
			
			subClass.baseConstructor = baseClass;
			subClass.superClass = baseClass.prototype;
		}
	};
	
	return __;
})();