steal(
'admin/mvc.js',
'steal/less',
'admin/rules'
).then('./form.less', function(){

	can.Control('Admin.Slots.Form', {}, {
		init : function(){
			this.element.html(this.view('init', {
				pages : Admin.Models.Page.findAll({})
			})).addClass('paper-form');
		},
		'.source-section change' : function(){
			var values = this.element.find('.source-section:checked').map(function(){
				return this.value;
			}).get().unique();
			this.element.find('.admin_rules').admin_rules({selectedContentTypes: values});
		}
	})
})