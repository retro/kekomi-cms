steal(
'admin/mvc.js',
'admin/content/types/atom',
'admin/content/types/block',
'admin/content/types/collection',
'steal/less',
'./helper.js'
).then(function(){
	can.Control('Admin.Content.Form', {
	}, {
		init : function(){
			this.element.html(this.view('init.ejs', {
				contentType: this.options.contentType,
				model : this.options.model
			}))
		},
		"form submit" : function(el, ev){
			this.options.model.attr('title', "MY TITLE")
			ev.preventDefault();
			console.log(this.options.model.serialize())
		}
	})
})