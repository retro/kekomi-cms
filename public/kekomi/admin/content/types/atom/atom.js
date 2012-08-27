steal(
'admin/mvc.js',
'can/observe/compute',
'jquery/event/key',
'admin/content/types/atom/rte',
'admin/content/types/atom/markdown'
).then(function(){
	can.Control('Admin.Content.Types.Atom', {
		defaults : {
			collection: false
		}
	}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined" || curVal === null){
				this.options.model.attr(this.options.attr, "")
			}
			this.element.html(this.view(this.options.field.type + ".ejs", {
				model : this.options.model,
				attr : this.options.attr,
				collection: this.options.collection,
				field: this.options.field
			}))
		},
		"input change"    : 'inputChanged',
		"textarea change" : 'inputChanged',
		inputChanged : function(el, ev){
			this.options.model.attr(this.options.attr, el.val());
		},
		".integer-field keydown" : function(el, ev){
			var charCode = ev.which;
			if (charCode > 31 && (charCode < 48 || charCode > 57) && [37, 38, 39, 40].indexOf(charCode) === -1){
				ev.preventDefault();
			}
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