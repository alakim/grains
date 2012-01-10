if(typeof(jQuery)!="function") alert("jquery.js module required!");
if(typeof(Html)!="object") alert("html.js module required!");

var HybridPage = (function(){
	
	function menuClick(pgID){
		if(!__.ws) throw "Missing web service link";
		$("#pageContent").html(Html.img({src:"wait.gif"}));
		__.ws.getData(pgID, function(data){
			__.pageID = pgID;
			__.data = data;
			$("#pageContent").html(__.templates.page());
			$("#header").html(__.templates.header());
			$("#pageLink").html(__.templates.pageLink());
		}, __.displayError);
	}
	
	var userMode = false;
	
	function setUserMode(){
		console.log("user mode!");
		$("a[href]").each(function(i,el){
			if(!__.isStaticPage(el.href)){
				var pgID = __.getPageID(el.href);
				$(el).click(userClick(pgID)).attr("href", "#"+pgID);
			}
		});
	}
	
	function userClick(pgID){
		return function(){
			menuClick(pgID);
		}
	}
	
	function initForm(){
		if(document.location.hash){
			var id = __.getHashPageID(document.location.hash);
			document.location.href = __.getPageLink(id);
		}
		$("body").one("mousemove", setUserMode);
	}
	
		
	var __ = {
		set: function(settings){
			for(var k in settings)
				__[k] = settings[k];
		},
		ws:null,
		pageID:null,
		data:null,
		templates:{
			set: function(settings){
				for(var k in settings)
					__.templates[k] = settings[k];
			},
			page: function(){with(Html){
				return __.data?div(
					__.data.content
				):null;
			}},
			header: function(){
				return __.data?__.data.title:null
			},
			pageLink: function(){with(Html){
				return a({href:__.getPageLink(__.pageID)},
					"Постоянная ссылка на данную страницу"
				);
			}}
		},
		isStaticPage: function(ref){
			return ref.match(/main\.htm$/i)!=null;
		},
		getPageID: function(ref){
			return ref.match(/(\d+)\.htm/i)[1];
		},
		getHashPageID: function(hash){
			return hash.match(/\d+/i);
		},
		getPageLink: function(pgID){
			return "page"+(pgID.match(/\d+/i)[0])+".htm";
		},
		displayError: function(err){
			alert(err);
		}
	}

	$(initForm);
	return __;
})();