steal(
'admin/mvc.js',
'admin/content/form',
'admin/content/list',
'steal/less',
'admin/content/types/atom'
).then(function(){
	can.Control('Admin.Content', {}, {
		init : function(){
			this.handleRouting();
		},
		handleRouting : function(){
			var contentType = Admin.Models.ContentType.all().get(can.route.attr('content_type'))[0];

			if(can.route.attr('action') === "new"){
				this.element.html($('<div/>').admin_content_form({
					model: new (contentType.contentTypeModel()),
					contentType: contentType
				}))
			} else if(can.route.attr('action') === "edit"){
				this.element.html($('<div/>').admin_content_form({
					model: contentType.contentTypeModel().findOne({id: can.route.attr('id')}),
					contentType: contentType
				}))
			} else if(can.route.attr('action') === "list"){
				this.element.html($('<div/>').admin_content_list({
					contentTypeModel: contentType.contentTypeModel()
				}))
			}
		}
	})
})