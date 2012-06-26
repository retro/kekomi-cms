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

	can.Control('Admin.Content.Types.Collection', {
	}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined"){
				this.options.model.attr(this.options.attr, [])
			}
			this.allowed = Admin.Models.FieldType.all().get(this.options.fieldType.allowed)[0];
			this.element.html(this.view('init.ejs', {
				fieldType: this.options.fieldType,
				attr: this.options.attr
			}))
			this.element.find('.collection-values').sortable({
				items: ".collection-value"
			})
		},
		".collection-values sortstop" : function(el, ev, ui){
			var values     = this.element.find('.collection-value'),
				controller = this.valueController(),
				newValue   = [],
				valueEl;
			for(var i = 0; i < values.length; i++){
				valueEl = values.eq(i);
				newValue.push(elValueController(this.valueController(), valueEl).value());
				valueEl[controller]({attr: i});
			}
			this.options.model.attr(this.options.attr).replace(newValue)
		},
		'.add-to-collection click' : function(el, ev){
			ev.preventDefault();
			ev.stopPropagation();
			this.element.find('.collection-values').append(this.renderField());
		},
		renderField : function(){
			var el         = $('<div/>').addClass('collection-value'),
				controller = this.valueController();
			return $(el)[controller]({
				model     : this.options.model.attr(this.options.attr), 
				attr      : this.options.model.attr(this.options.attr).length, 
				fieldType : this.allowed, 
				field     : {
					type: this.allowed.id
				}
			})
		},
		valueController : function(){
			var controller = "admin_content_types_" + this.allowed.type;
			return $.fn[controller + '_' + this.allowed.id] ? controller + '_' + this.allowed.id : controller;
		}
	})
})