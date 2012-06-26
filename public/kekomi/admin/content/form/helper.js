steal('admin/mvc.js', 'can/view/ejs', function(){
	can.EJS.Helpers.prototype.renderField = function(el, field, model, attr){
		var fieldType  = Admin.Models.FieldType.all().get(field['type'])[0],
			controller = "admin_content_types_" + fieldType.type;

		controller = $.fn[controller + '_' + field['name']] ? controller + '_' + field['name'] : controller;
		$(el)[controller]({field: field, model: model, attr: attr, fieldType: fieldType})
	}
})