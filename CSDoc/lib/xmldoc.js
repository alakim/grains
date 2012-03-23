var XmlDoc = (function(){

	function CreateRequest(){
		var Request = false;
		if (window.XMLHttpRequest){
			Request = new XMLHttpRequest();
		}
		else if (window.ActiveXObject){
			Request = new ActiveXObject("Microsoft.XMLHTTP");
			if (!Request) HRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
	 
		if (!Request)
			alert("Невозможно создать XMLHttpRequest");
		
		return Request;
	}

	function SendRequest(r_method, r_path, r_args, r_handler){
		var Request = CreateRequest();
		if (!Request) return;
		
		Request.onreadystatechange = function(){
			if (Request.readyState == 4)
				r_handler(Request);
		}
		
		if (r_method.toLowerCase() == "get" && r_args.length > 0)
		r_path += "?" + r_args;
		
		Request.open(r_method, r_path, true);
		
		if (r_method.toLowerCase() == "post"){
			Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
			Request.send(r_args);
		}
		else
			Request.send(null);
	}

	function GetXMLFile(filename, handler){
		SendRequest("GET",filename,"",handler);
	}

	var __ = {
		load: function(xmlDocFile, onload){
			var xdoc = GetXMLFile(xmlDocFile, function(res){
				var doc = res.responseXML.documentElement;
				onload(doc);
			});
		}
	};
	
	return __;
})();