steal(
'admin/mvc.js',
'steal/less',
'admin/util/form_params'
).then('./default_mappings.less', function(){

	var makeArray = function(slots){
		var arr = [];
		for(var slot in slots){
			if(slots.hasOwnProperty(slot)){
				arr.push(slots[slot]);
			}
		}
		console.log(arr)
		return arr;
	}

	can.Control('Admin.Slots.DefaultMappings', {}, {
		init : function(){
			this.element.html(this.view('init', {
				slots    : can.view.render('//admin/slots/default_mappings/views/options', { slots: this.options.slots }),
				defaults : this.options.defaults
			})).addClass('paper-form');
		},
		"form submit" : function(el, ev){
			ev.preventDefault();
			var params = makeArray(el.formParams().slots);
			this.options.defaults.attr('slots', params);
			this.options.defaults.save(function(){
				can.route.attr({type: 'slots', action: 'list'})
			})
		}
	})
})