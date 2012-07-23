steal(
'admin/mvc.js',
'admin/content/form',
'admin/content/list',
'steal/less'
).then(function(){
	can.Control('Admin.Content', {}, {
		init : function(){
			this.element.html(this.view("init.ejs")).addClass('has-header');
			this.handleRouting();
		},
		"{can.route} type change" : "handleRouting",
		"{can.route} content_type change" : "handleRouting",
		"{can.route} action change" : "handleRouting",
		handleRouting : function(){

			if(can.route.attr('type') === "content"){
				clearTimeout(this._action);
				this._action = setTimeout(this.proxy(this[can.route.attr('action') + "Action"]), 1);
			}
		},
		newAction: function(){
			var contentType = Admin.Models.ContentType.all().get(can.route.attr('content_type'))[0];
			this.element.find('.module-content').html($('<div/>').admin_content_form({
				model: new (contentType.contentTypeModel()),
				contentType: contentType
			}))
		},
		editAction: function(){
			var contentType = Admin.Models.ContentType.all().get(can.route.attr('content_type'))[0];
			contentType.contentTypeModel().findOne({id: can.route.attr('id')}, this.proxy(function(model){
				this.element.find('.module-content').html($('<div/>').admin_content_form({
					model: model,
					contentType: contentType
				}))
			}))
		},
		listAction: function(){
			var contentType = Admin.Models.ContentType.all().get(can.route.attr('content_type'))[0];
			this.element.find('.module-content').html($('<div/>').admin_content_list({
				contentTypeModel: contentType.contentTypeModel()
			}))
		},
	})
})