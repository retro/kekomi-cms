steal(
'admin/pages',
'admin/nav',
'admin/style',
'admin/models',
'admin/content',
function(){
	can.route.ready(false);
	$.when(Admin.Models.ContentType.preload(), Admin.Models.FieldType.preload(), Admin.Models.Template.preload()).then(function(){
		
		/*can.route("content/:content_type/:action/:id", {type: "content"})
		can.route("content/:content_type/:action", {type: "content"});
		can.route("content/:content_type", {type: "content", action: "list"});

		can.route(":type/:action/:id")
		can.route(":type/:action")
		can.route(":type",{ type: "pages", action: "list" });*/
		
		


		$('#navigation').admin_nav();
		can.route.ready(true);
	})
	
})