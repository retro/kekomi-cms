steal(
'admin/mvc.js',
'steal/less',
'admin/content/form'
).then('./content.less', function(){

	can.Control('Admin.Pages.Content', {

	}, {
		init : function(){
			Admin.Models.ContentType.pageContentTypes(can.route.attr('id'), this.proxy('render'));
		},
		render : function(contentTypes){
			this.contentTypes = contentTypes;
			this.element.html(this.view('init', {
				models : contentTypes
			})).addClass('paper-form');
			this.element.find('.open-page-content-form:first').click();
		},
		'.open-page-content-form click' : function(el, ev){
			var contentType = el.data('contentType');
			contentType.contentTypeModel().findOne({}, this.proxy(function(model){
				this.element.find('.form-panel').html($('<div/>').admin_content_form({
					model: model,
					contentType: contentType,
					isInsideTab: false,
					savedUrl : {type: 'pages', action: "list"}
				}))
			}))
		}
	})
})