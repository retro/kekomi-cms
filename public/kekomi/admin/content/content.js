steal(
'admin/mvc.js',
'admin/content/form',
'admin/content/list',
'steal/less',
'admin/content/types/atom'
).then(function(){
	can.Control('Admin.Content', {}, {
		init : function(){
			this.element.html(this.view("init.ejs")).addClass('has-header');
			this.handleRouting();
		},
		"{can.route} id change" : "handleRouting",
		"{can.route} content_type change" : "handleRouting",
		"{can.route} action change" : "handleRouting",
		handleRouting : function(){

			var contentType = Admin.Models.ContentType.all().get(can.route.attr('content_type'))[0];

			if(can.route.attr('action') === "new"){
				this.element.find('.module-content').html($('<div/>').admin_content_form({
					model: new (contentType.contentTypeModel()),
					contentType: contentType
				}))
			} else if(can.route.attr('action') === "edit"){
				contentType.contentTypeModel().findOne({id: can.route.attr('id')}, this.proxy(function(model){
					this.element.find('.module-content').html($('<div/>').admin_content_form({
						model: model,
						contentType: contentType
					}))
				}))
			} else if(can.route.attr('action') === "list"){
				this.element.find('.module-content').html($('<div/>').admin_content_list({
					contentTypeModel: contentType.contentTypeModel()
				}))
			}
		}
	})
})