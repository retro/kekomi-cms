steal(
'admin/mvc.js',
'steal/less'
).then('./list.less', function(){
	can.Control('Admin.Content.List', {}, {
		init : function(){
			this.element.addClass('paper').html(this.view('init', {
				items: this.options.contentTypeModel.findAll({}),
				contentType: this.options.contentTypeModel
			}))
		}
	})
})