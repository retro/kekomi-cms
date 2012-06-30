steal('can/construct', 'jquery/lang/json', function(){
	$.ajaxPrefilter(function(options, originalOptions, xhr){
		if(originalOptions.dataType.toLowerCase() === "json"){
			
			options.url  = "/admin" + options.url;
			//console.log(options.type.toUpperCase())
			if(["POST", "PUT"].indexOf(options.type.toUpperCase()) > -1){
				options.data = $.toJSON(originalOptions.data)
				options.contentType = "application/json";
			}
			
			
		}
	})
})