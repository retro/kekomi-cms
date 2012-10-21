steal('can/construct', 'jquery/lang/json', function(){
	$.ajaxPrefilter(function(options, originalOptions, xhr){
		var dataType = originalOptions.dataType && originalOptions.dataType.toLowerCase();
		if(dataType === "json" || dataType === "templatecontenttypes"){
			options.url  = "/admin" + options.url;
			if(["POST", "PUT"].indexOf(options.type.toUpperCase()) > -1){
				if(originalOptions.data.toString() === "[object Object]"){
					options.data = $.toJSON(originalOptions.data)
					options.contentType = "application/json";
				}
			}
			
			
		}
	})
})