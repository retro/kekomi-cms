steal('admin/pages', 'admin/nav', 'admin/style', function(){
	can.route(":type",{ type: "pages" })
	$('#navigation').admin_nav();
})