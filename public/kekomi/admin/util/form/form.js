steal('admin/mvc.js', 'admin/util/form_params', function(){

	var showErrors = function(errors){
		var self = this;
		$.each(errors, function(key, value){
			var input = self.element.find('#' + self.options.model.constructor._shortName + '_' + key);
			input.after('<span class="help-inline error-wrap">' + value.join(', ') + '</span>');
			input.closest('.control-group').addClass('error');
		})
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
			console.log(this.options.model.serialize())
			//return
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