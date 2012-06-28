steal(
'admin/mvc.js',
'admin/content/form/helper.js',
'admin/vendor/jqueryui'
).then(function(){

	var elValueController = function(controller, el){
		var controls = el.data('controls') || [];
		for(var i = 0; i < controls.length; i++){
			if(controls[i].constructor._fullName === controller){
				return controls[i];
			}
		}
	}

	can.Control('Admin.Content.Types.Compound', {
	}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined"){
				this.options.model.attr(this.options.attr, [])
			}
			this.element.html(this.view('init.ejs', {
				fieldType: this.options.fieldType,
				attr: this.options.attr
			}))
			this.element.find('.compound-values').sortable({
				items: ".compound-value"
			})
		},
		".compound-values sortstop" : function(el, ev, ui){
			var values     = this.element.find('.compound-value'),
				newValue   = [],
				valueEl, controller, elValue;
			for(var i = 0; i < values.length; i++){
				valueEl = values.eq(i);
				elValue = {
					type: valueEl.data('field-type'), 
					value: elValueController(this.valueController(valueEl), valueEl).value()
				}
				newValue.push(elValue);
			}
			
			this.options.model.attr(this.options.attr).replace(newValue)
		},
		'.add-to-compound click' : function(el, ev){
			ev.preventDefault();
			ev.stopPropagation();
			this.element.find('.compound-values').append(this.renderField(el));
		},
		renderField : function(buttonEl){
			var field_type = buttonEl.data('field-type'),
				allowed    = this.allowed().get(field_type)[0],
				el         = $('<div/>').addClass('compound-value').data('field-type', field_type),
				controller = this.valueController(buttonEl),
				model      = new can.Observe({type: field_type});
				this.options.model.attr(this.options.attr).push(model)
			return $(el)[controller]({
				model     : model, 
				attr      : 'value', 
				fieldType : allowed, 
				field     : {
					type: allowed.id,
					name: allowed.name
				},
				collection: true
			})
		},
		allowed : function(){
			if(typeof this._allowed === "undefined"){
				var fieldTypes = Admin.Models.FieldType.all();
				this._allowed  = fieldTypes.get.apply(fieldTypes, this.options.fieldType.allowed);
			}
			return this._allowed;
		},
		valueController : function(el){
			//console.log(field_type, this.allowed())
			var field_type = el.data('field-type'),
				allowed    = this.allowed().get(field_type)[0],
				controller = "admin_content_types_" + allowed.type;
			return $.fn[controller + '_' + allowed.id] ? controller + '_' + allowed.id : controller;
		},
		".remove click" : function(el, ev){
			var valueEl = el.closest('.compound-value');
			var index = this.element.find('.compound-value').index(valueEl);
			this.options.model.attr(this.options.attr).splice(index, 1);
			valueEl.remove();
		}
	})
})