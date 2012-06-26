steal(
'admin/mvc.js',
'can/observe/compute'
).then(function(){
	can.Control('Admin.Content.Types.Atom', {}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined"){
				this.options.model.attr(this.options.attr, "")
			}
			this.element.html(this.view(this.options.field.type + ".ejs", {
				model : this.options.model,
				attr : this.options.attr
			}))
		},
		"input change"    : 'inputChanged',
		"textarea change" : 'inputChanged',
		inputChanged : function(el, ev){
			this.options.model.attr(this.options.attr, el.val());
		},
		"{model} change" : function(Model, ev, attr, how, val, oldVal){
			if(attr === this.options.attr){
				this.setVal(val);
			}
		},
		setVal : function(val){
			this.element.find('input').val(val)
		},
		value : function(){
			return this.options.model.attr(this.options.attr);
		}
	})
})