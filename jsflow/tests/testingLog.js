function TestingLog(){
}

(function(){
	function extend(o,s){for(var k in s)o[k]=s[k];}

	var __=TestingLog;
	
	__.prototype = new JSFlow.Log();
	
	extend(__.prototype, {
		expectations:[],
		render: function(){with(Html){var _=this;
			return div(
				_.log.length!=_.expectations.length?div({style:"color:#f00"},
					format("Log length is {0}, but {1} expected", _.log.length, _.expectations.length)
				):null,
				apply(_.log, function(msg, i){
					var ok = _.expectations[i]==msg;
					return div(i+1, ": ", 
						span({style:"color:#"+(ok?"080":"f00")},
							msg,
							ok?span({style:"font-weight:bold; color:#080; margin-left:25px;"}, "OK")
								:span({style:"margin-left:20px;"}, " (Expected '", _.expectations[i], "')")
						)
					);
				})
			);
		}}
	});
})();
