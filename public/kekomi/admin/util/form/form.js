steal('admin/mvc.js', function(){

	var showErrors = function(errors){
		var self = this;
		$.each(errors, function(key, value){
			var input = self.element.find('#' + self.options.model.constructor._shortName + '_' + key);
			input.after('<span class="help-inline error-wrap">' + value.join(', ') + '</span>');
			input.closest('.control-group').addClass('error');
		})
	}

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


	can.Control('Admin.Util.Form', {

	}, {
		init : function(){
			//console.log(this.options.model.attr())
			this.element.formParams({page: this.options.model.attr()})
		},
		" submit" : function(el, ev){
			ev.preventDefault();
			this.element.find('.error-wrap').remove();
			this.element.find('.error').removeClass('error');
			var data = el.formParams().page;
			this.options.model.attr(data);
			var errors = this.options.model.errors();
			if($.isEmptyObject(errors)){
				this.options.model.save(this.proxy('saved'));
			} else {
				showErrors.call(this, errors);
			}
		},
		saved : function(){
			this.element.trigger('saved');
		}
	})
})