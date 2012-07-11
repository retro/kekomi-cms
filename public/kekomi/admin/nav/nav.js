steal('admin/mvc.js', 'admin/vendor/inflection', 'steal/less').then('./nav.less', function(){
	can.Control('Admin.Nav', {}, {
		init : function(){
			this.element.html(this.view('init', {
				contentTypes: Admin.Models.ContentType.all()
			}))
		},
		".dropdown-toggle click" : function(el, ev){
			ev.stopPropagation();
			el.siblings('.dropdown-menu').toggle();
		},
		"{document} click" : function(el, ev){
			this.element.find('.dropdown-menu').hide();
		},
		"{can.route} type change" : function(){
			var control = "admin_" + can.route.attr('type');
			if($.fn[control]){
				$('#content').html($('<div/>')[control]())
			} else {
				$('#content').html("Controller <b>" + control + "</b> doesn't exist!")
			}
		}
	})
})