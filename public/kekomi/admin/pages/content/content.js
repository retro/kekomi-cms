steal(
'admin/mvc.js',
'steal/less',
'admin/content/form'
).then(function(){

	can.Control('Admin.Pages.Content', {

	}, {
		init : function(){
			Admin.Models.ContentType.pageContentTypes(can.route.attr('id'), this.proxy('render'));
		},
		render : function(contentTypeModels){
			this.element.html(this.view('init', {
				models : contentTypeModels
			})).addClass('paper-form')
		}
	})
})