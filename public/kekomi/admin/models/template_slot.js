steal('can/model', 'can/observe/attributes', function(){

/**
 * @class Admin.Models.TemplateSlot
 * @parent index
 * @inherits can.Model
 * Wraps backend content services.  
 */
can.Model('Admin.Models.TemplateSlot',
/* @Static */
{
	findAll      : "/template_slots",
	findOne      : "/template_slots/{id}",
	update       : "/template_slots/{id}",
	defaultSlots : function(success, error){
		return this.findOne({id: 'default'}, success, error)
	}
},
/* @Prototype */
{
	defaultSlotFor: function(slotName){
		if(typeof this._defaultSlotMappings === "undefined"){
			this._defaultSlotMappings = {};
			for(var i = 0; i < this.slots.length; i++){
				this._defaultSlotMappings[this.slots[i].template_slot] = this.slots[i].slot_id;
			}
		}
		return this._defaultSlotMappings[slotName] ? this._defaultSlotMappings[slotName] : null;
	}
});

can.Model.List('Admin.Models.TemplateSlot.List', {}, {
	normalizedSlots : function(){
		return this.map(function(template_slot){
			var slots = template_slot.attr('slots');
			return slots ? slots.attr() : [];
		}).flatten().unique().sort();
	}
})


})