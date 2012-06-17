steal('can/construct', function(){
	$.ajaxPrefilter(function(options, originalOptions, xhr){
		if(originalOptions.dataType.toLowerCase() === "json"){
			options.url = "/admin" + options.url;
		}
	})
})