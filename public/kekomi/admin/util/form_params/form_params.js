steal('jquery/dom/form_params', function(){
	var keyBreaker = /([^\[\]]+)|(\[\])/g;
	var getValue = function(params, keyArray){
		var value = params;
		while(keyArray.length > 0){
			var key = keyArray.shift();
			value = value.attr ? value.attr(key) : value[key];
			if(typeof value === "undefined"){
				return;
			}
		}
		return value;
	}

	$.fn.setParams = function( params ) {
		// Find all the inputs
		this.find("[name]").each(function() {
			
			var value = getValue(params, $(this).attr("name").match(keyBreaker)),
				$this;
			
			// Don't do all this work if there's no value
			if ( value !== undefined ) {
				$this = $(this);
				
				// Nested these if statements for performance
				if ( $this.is(":radio") ) {
					if ( $this.val() == value ) {
						$this.attr("checked", true);
					}
				} else if ( $this.is(":checkbox") ) {
					// Convert single value to an array to reduce
					// complexity
					value = $.isArray( value ) ? value : [value];
					if ( $.inArray( $this.val(), value ) > -1) {
						$this.attr("checked", true);
					}
				} else {
					$this.val( value );
				}
			}
		});
	}
})