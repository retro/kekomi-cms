steal(
'admin/mvc.js',
'steal/less',
'admin/rules'
).then('./form.less', function(){

	can.Control('Admin.Slots.Form', {}, {
		init : function(){
			Admin.Models.Page.findAll({}, this.proxy('render'))
		},
		render : function(pages){
			this.element.html(this.view('init', {
				pages : pages
			})).addClass('paper-form');
			this.element.find('input[type=checkbox]').prop('checked', true).filter(':first').trigger('change')
		},
		'.source-section change' : function(){
			var values = this.element.find('.source-section:checked').map(function(){
				return this.value;
			}).get().unique();
			if(typeof this.rules === "undefined"){
				this.rules = new Admin.Rules(this.element.find('.admin_rules'), {selectedContentTypes: values});
			} else {
				this.element.find('.admin_rules').admin_rules({selectedContentTypes: values})
			}
			
			this.element.find('.admin-rules-wrap').toggle(values.length !== 0);
		},
		'form submit' : function(el, ev){
			ev.preventDefault();
			var rules = this.rules.serialize();
			if(rules !== false){

			}
		}
	})
})