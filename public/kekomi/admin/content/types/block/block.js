steal(
'admin/mvc.js',
'admin/content/form/helper.js',
'admin/content/types/block/image',
'admin/content/types/block/attachment'
).then(function(){
	can.Control('Admin.Content.Types.Block', {
		defaults: {
			collection: false
		}
	}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === 'undefined' || curVal === null){
				this.options.model.attr(this.options.attr, {});
			}
			this.element.html(this.view('init.ejs', {
				fieldType: this.options.fieldType,
				model : this.options.model.attr(this.options.attr),
				attr : this.options.attr,
				collection: this.options.collection
			}))
		},
		value : function(){
			return this.options.model.attr(this.options.attr).serialize()
		}
	})
})