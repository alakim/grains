if(typeof(jQuery)!="function") alert("jquery.js module required!");

var HybridPage = (function(){
	
	function menuClick(pgID){
		$("#pageContent").html(__.templates.page(pgID));
		$("#header").html(__.templates.header(pgID));
		$("#pageLink").html(__.templates.pageLink(pgID));
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
			document.location.href = __.getPageLink(document.location.hash);
		}
		$("body").one("mousemove", setUserMode);
	}
		
	var __ = {
		templates:{
			page: function(pgID){with(Html){
				return div(
					"Page ", pgID.match(/\d+/i)[0], " content."
				);
			}},
			header: function(pgID){
				return "Page "+pgID.match(/\d+/i)[0]
			},
			pageLink: function(pgID){with(Html){
				return a({href:__.getPageLink(pgID)},
					"Постоянная ссылка на данную страницу"
				);
			}}
		},
		isStaticPage: function(ref){
			return ref.match(/main\.htm$/i)!=null;
		},
		getPageID: function(ref){
			return "p"+ref.match(/(\d+)\.htm/i)[1];
		},
		getPageLink: function(pgID){
			return "page"+(pgID.match(/\d+/i)[0])+".htm";
		}
	}

	$(initForm);
	return __;
})();