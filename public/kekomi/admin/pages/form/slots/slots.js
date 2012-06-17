steal('admin/mvc.js', function(){
	can.Control('Admin.Pages.Form.Slots', {}, {
		init : function(){
			this.element.html(this.view('init.ejs'))
		}
	})
})