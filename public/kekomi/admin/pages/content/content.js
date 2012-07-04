steal(
'admin/mvc.js',
'steal/less',
'admin/content/form'
).then(function(){

	can.Control('Admin.Pages.Content', {

	}, {
		init : function(){
			this.contentType      = Admin.Models.ContentType.all().get(this.options.page.content_node_type)[0];
			this.contentTypeModel = this.contentType.contentTypeModel();
			if(typeof this.options.page.content_node_id !== "undefined"){
				this.contentTypeModel.findOne({id: this.options.page.content_node_id}, this.proxy("renderForm"));
			} else {
				this.renderForm(new this.contentTypeModel({page_id: this.options.page.id}))
			}
		},
		renderForm : function(content){
			this.content = content;
			this.element.admin_content_form({
				contentType : this.contentType,
				model       : this.content,
				save        : this.proxy('save')
			})
		},
		save : function(){
			console.log("SAVE")
			this.content.save(function(){
				can.route.attr({type: "pages", action: "list"})
			})
		}
	})
})