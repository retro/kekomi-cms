steal(
'admin/mvc.js'
).then(function(){
	can.Control('Admin.Content.List', {}, {
		init : function(){
			this.element.html(this.view('init', {
				items: this.options.contentTypeModel.findAll({})
			}))
		}
	})
})