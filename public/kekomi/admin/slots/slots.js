steal(
'admin/mvc.js',
'steal/less',
'admin/slots/list',
'admin/slots/form',
'admin/slots/default_mappings',
function(){
	can.Control('Admin.Slots', {}, {
		init : function(){
			this.element.html(this.view("init.ejs")).addClass('has-header')
			this.handleRouting()
		},
		"{can.route} type change" : "handleRouting",
		"{can.route} action change" : "handleRouting",
		handleRouting : function(){
			var actionName;
			if(can.route.attr('type') === "slots"){
				actionName = can.route.attr('action').camelize().replace(/^[A-Z]{1}/, function(letter){ return letter.toLowerCase() })
				clearTimeout(this._action);
				this._action = setTimeout(this.proxy(this[actionName + "Action"]), 1);
			}
			
		},
		listAction : function(){
			var div = $('<div/>').admin_slots_list();
			this.element.find('.module-content').html(div);
		},
		newAction : function(){
			this.element.find('.module-content').html($('<div/>').admin_slots_form({
				slot: new Admin.Models.Slot
			}));
		},
		editAction : function(){
			Admin.Models.Slot.findOne({id: can.route.attr('id')}, this.proxy(function(slot){
				this.element.find('.module-content').html($('<div/>').admin_slots_form({
					slot: slot
				}));
			}))
		},
		defaultMappingsAction : function(){
			$.when(Admin.Models.Slot.findAll({}), Admin.Models.TemplateSlot.defaultSlots()).then(this.proxy(function(slots, defaults){
				this.element.find('.module-content').html($('<div/>').admin_slots_default_mappings({
					slots: slots[0],
					defaults: defaults[0]
				}));
			}))
		}
	})
})