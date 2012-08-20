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
			var options       = this.element.find('select.rule option');
			var types         = this.presentFieldTypes();
			var sharedFields  = this.sharedFields();
			var self          = this;
			var fieldsPerType = this.fieldsPerType();
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

			
			for(var fieldType in fieldsPerType){
				if(fieldsPerType.hasOwnProperty(fieldType)){
					(function(type, fields){
						self.element.find('.' + type + '-fields').each(function(i, el){
							var select  = $(el);
							var options = ['<option value="">Select Field</option>'];
							var value   = select.val();
							for(var i = 0; i < fields.length; i++){
								options.push('<option value="' + fields[i] + '">' + fields[i] + '</option>')
							}
							select.html(options.join('')).val(value);
							if(select.val() !== value){
								select.closest('.rule-wrap').addClass('has-errors')
							}
						})
					})(fieldType, fieldsPerType[fieldType]);
				}
			}
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
		fieldsPerType : function(){
			var fields = this.sharedFields();
			var fieldsPerType = {};
			for(var field in fields){
				if(fields.hasOwnProperty(field)){
					fieldsPerType[fields[field]] = fieldsPerType[fields[field]] || [];
					fieldsPerType[fields[field]].push(field);
				}
			}
			return fieldsPerType;
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
		serialize : function(){
			var rules     = [];
			var hasErrors = false;
			this.element.find('.rule-wrap').each(function(i, el){
				var $el   = $(el);
				var rule  = $el.data('rule');
				var field = $el.find('select').val();
				if(rule !== "tagged_with"){
					if(['contains', 'ends_with', 'starts_with', 'equals'].indexOf(rule) !== -1){
						var value = $el.find('input').val();
						if(field === "" || value === ""){
							hasErrors = true;
							$el.closest('.rule-wrap').addClass('has-errors');
							return
						}
						rules.push({
							field : field,
							value : value,
							rule  : rule
						})
					} else if(['date_after', 'date_before', 'date_equal'].indexOf(rule) !== -1){
						var value = $el.find('input').datepicker('getDate');
						if(field === "" || value === null){
							hasErrors = true;
							$el.closest('.rule-wrap').addClass('has-errors');
							return;
						}
						rules.push({
							field : field,
							value : value.getTime(),
							rule  : rule
						})
					} else if(rule === 'date_period'){
						var start = $el.find('input:first').datepicker('getDate');
						var end   = $el.find('input:last').datepicker('getDate');
						if(field === "" || start === null || end === null){
							hasErrors = true;
							$el.closest('.rule-wrap').addClass('has-errors');
							return;
						}
						rules.push({
							field : field,
							value : [start.getTime(), end.getTime()],
							rule  : rule
						})
					} else if(rule === "or"){
						rules.push({
							rule: rule
						})
					}
				}
				if(rule === "tagged_with"){
					var value = $el.find('input').val();
					if(value === ""){
						hasErrors = true;
						$el.closest('.rule-wrap').addClass('has-errors');
						return;
					}
					rules.push({
						rule: rule,
						value: value
					})
				}
				
			})
			return hasErrors ? false : rules;
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
		},
		'.rule-wrap select change' : function(el, ev){
			if(el.closest('.rule-wrap').find('input').val() !== ""){
				el.closest('.rule-wrap').removeClass('has-errors');
			}
		},
		'.rule-wrap input change' : function(el, ev){
			if(el.closest('.rule-wrap').find('select').val() !== ""){
				el.closest('.rule-wrap').removeClass('has-errors');
			}
		},
		'input.range focus' : function(el, ev){
			ev.stopPropagation();
			ev.stopImmediatePropagation();
		}
	})
})