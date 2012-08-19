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
			this.element.html(this.view('init'));
			this.recalculateRules();
		},
		update : function(){
			this._super.apply(this, arguments);
			this.recalculateRules();
		},
		recalculateRules : function(){
			delete this.sharedFieldsList;
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
				} else {
					$option.prop('disabled', false);
				}
			});
		},
		sharedFields : function(){
			if(typeof this.sharedFieldsList === "undefined"){
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
				this.sharedFieldsList = fields;
				return fields;
			} else {
				return this.sharedFieldsList;
			}
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
		},
		".add-rule click" : function(el, ev){
			var rule = this.element.find('.rule').val();
			if(rule !== ""){
				this.element.find('.rules').append(this.view('rules/' + rule, {
					fields : this.sharedFields()
				}))
			}
		},
		".remove-rule click" : function(el, ev){
			el.closest('.rule-wrap').remove();
		}
	})
})