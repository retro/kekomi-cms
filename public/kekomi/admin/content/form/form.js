steal(
'admin/mvc.js',
'admin/content/types/atom',
'admin/content/types/block',
'admin/content/types/collection',
'admin/content/types/compound',
'steal/less',
'./helper.js'
).then('./form.less', function(){
	can.Control('Admin.Content.Form', {
	}, {
		init : function(){
			this.element.html(this.view('init.ejs', {
				contentType: this.options.contentType,
				model : this.options.model
			}))
		},
		"form submit" : function(el, ev){
			ev.preventDefault();
			this.options.model.save();
		}
	})
})