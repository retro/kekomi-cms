steal('can/construct', 'jquery/lang/json', function(){
	$.ajaxPrefilter(function(options, originalOptions, xhr){
		if(originalOptions.dataType && originalOptions.dataType.toLowerCase() === "json"){
			
			options.url  = "/admin" + options.url;
			//console.log(originalOptions)
			if(["POST", "PUT"].indexOf(options.type.toUpperCase()) > -1){
				if(originalOptions.data.toString() === "[object Object]"){
					options.data = $.toJSON(originalOptions.data)
					options.contentType = "application/json";
				}
			}
			
			
		}
	})
})