steal('can/construct', 'jquery/lang/json', function(){
	$.ajaxPrefilter(function(options, originalOptions, xhr){
		if(originalOptions.dataType.toLowerCase() === "json"){
			
			options.url  = "/admin" + options.url;
			if(options.type.toUpperCase() === "POST"){
				options.data = $.toJSON(originalOptions.data)
				options.contentType = "application/json";
			}
			
			
		}
	})
})