steal('admin/mvc.js', 'admin/vendor/inflection', function(){
	can.Control('Admin.Nav', {}, {
		init : function(){
			this.element.html(this.view('init', {
				contentTypes: Admin.Models.ContentType.all()
			}))
		},
		"{can.route} type set" : function(){
			var control = "admin_" + can.route.attr('type');
			if($.fn[control]){
				$('#content').html($('<div/>')[control]())
			} else {
				$('#content').html("Controller <b>" + control + "</b> doesn't exist!")
			}
		}
	})
})