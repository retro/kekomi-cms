steal(
'admin/mvc.js',
'steal/less'
).then('./rules.less', function(){

	var contentTypes = {};

	can.Control('Admin.Rules', {}, {
		init : function(){
			Admin.Models.ContentType.findAll({}, this.proxy('render'));
		},
		render : function(contentTypes){
			this.contentTypes = contentTypes;
			this.element.html(this.view('init'))
		},
		update : function(){
			this._super.apply(this, arguments);
			this.recalculateRules();
		},
		recalculateRules : function(){
			var options = this.element.find('select.rule option');
			var types   = this.presentFieldTypes();
			if(this.options.selectedContentTypes.length === 0){
				this.element.find('.rules').empty();
			}
			
			$.each(options, function(i, option){
				var $option   = $(option);
				var fieldType = $option.data('field-type');
				if(typeof fieldType !== 'undefined' && types.indexOf(fieldType) === -1){
					$option.prop('disabled', true);
				}
			})
		},
		sharedFields : function(){
			var fields            = {};
			var contentTypes      = this.contentTypes.get(this.options.selectedContentTypes);
			var contentTypeFields = [];
			var wasFound          = false;
			for(var i = 0; i < contentTypes.length; i++){
				contentTypeFields = contentTypes[i].attr('fields').attr();
				if($.isEmptyObject(fields)){
					for(var j = 0; j < contentTypeFields.length; j++){
						if(['string', 'date'].indexOf(contentTypeFields[j].type) !== -1){
							fields[contentTypeFields[j].name] = contentTypeFields[j].type;
						}
					}
				} else {
					for(var field in fields){
						wasFound = false;
						if(fields.hasOwnProperty(field)){
							for(var j = 0; j < contentTypeFields.length; j++){
								if(field === contentTypeFields[j].name){
									wasFound = true;
									if(fields[field] !== contentTypeFields[j].type){
										delete fields[field];
									}
								}
							}
						}
						if(!wasFound){
							delete fields[field];
						}
					}
				}
			}
			if(!$.isEmptyObject(fields)){
				$.extend(fields, {
					published_at : 'date',
					tags : 'tags'
				});
			}
			console.log(fields)
			return fields;
		},
		presentFieldTypes : function(){
			var fields = this.sharedFields();
			var types  = [];
			for(var field in fields){
				if(fields.hasOwnProperty(field)){
					types.push(fields[field]);
				}
			}
			return types.unique();
		}
	})
})