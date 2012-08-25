steal(
'admin/mvc.js',
'steal/less',
'admin/rules',
'admin/util/form_params'
).then('./form.less', function(){

	can.Control('Admin.Slots.Form', {}, {
		init : function(){
			Admin.Models.Page.findAll({}, this.proxy('render'))
		},
		render : function(pages){
			this.element.html(this.view('init', {
				pages : pages
			})).addClass('paper-form');
			this.element.find('form').formParams({ slot: this.options.slot.attr() });
			this.loadRules();
			if(!this.options.slot.isNew()){
				this.loadRules();
			}
		},
		loadRules : function(){
			var sections = this.element.find('.source-section:checked');
			var values   = sections.map(function(){
				return $(this).data('type');
			}).get().unique();
			var rulesOptions = {
				selectedContentTypes: values,
				rules: this.options.slot.attr('rules'),
				sectionsCount : sections.length
			};
			if(typeof this.rules === "undefined"){
				this.rules = new Admin.Rules(this.element.find('.admin_rules'), rulesOptions);
			} else {
				this.element.find('.admin_rules').admin_rules(rulesOptions);
			}
			this.element.find('.admin-rules-wrap').toggle((values.length !== 0 && this.element.find('[name="slot[type]"]:checked').val() === "automatic"));
		},
		'.source-section change' : function(){
			if(this.element.find('[name="slot[type]"]:checked').val() === "automatic"){
				this.loadRules();
			}
		},
		'[name="slot[type]"] change' : function(el, ev){
			if(el.val() === "manual"){
				this.element.find('.admin-rules-wrap').hide();
			} else {
				this.loadRules();
			}
		},
		'form submit' : function(el, ev){
			ev.preventDefault();
			var rules = this.rules ? this.rules.serialize() : null;
			var data  = el.formParams().slot;
			if(!$.isArray(data.sections)){
				data.sections = [data.sections];
			}
			this.options.slot.attr(data)
			if(rules !== false){
				this.options.slot.attr('rules', (this.options.slot.attr('type') === "automatic" ? rules : null));
				this.options.slot.save(function(){
					can.route.attr({type: 'slots', action: 'list'})
				});
			}
		}
	})
})