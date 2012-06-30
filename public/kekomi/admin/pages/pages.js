steal(
'admin/mvc.js',
'admin/pages/form',
'steal/less',
'admin/pages/tree'
).then('./pages.less', function(){
	can.Control('Admin.Pages', {}, {
		init : function(){
			this.element.html(this.view("init.ejs"))
			this.handleRouting()
		},
		"{can.route} change" : "handleRouting",
		handleRouting : function(){
			if(can.route.attr('type') === "pages"){
				clearTimeout(this._action);
				this._action = setTimeout(this.proxy(this[can.route.attr('action') + "Action"]), 1);
			}
			
		},
		listAction : function(){
			var div = $('<div/>').admin_pages_tree();
			this.element.find('.module-content').html(div);
		},
		newAction : function(){
			this.element.find('.module-content').html($('<div/>').admin_pages_form({
				page: new Admin.Models.Page
			}));
		}
	})
	
})