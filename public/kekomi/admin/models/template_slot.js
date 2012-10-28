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
	},
	byFolderAndType : function(folder, type, success, error){
		return this.findOne({id: [folder,type].join("/")}, success, error)
	}
},
/* @Prototype */
{
	defaultSlotFor: function(slotName){
		return this._defaultSlotMappings ? (this._defaultSlotMappings[slotName] || null) : null;
	},
	setDefaultMappings : function(mappings){
		this._defaultSlotMappings = {};
		for(var i = 0; i < mappings.length; i++){
			var mapping = mappings[i];
			this._defaultSlotMappings[mapping.template_slot] = mapping.slot_id ? {
				name: mappings[i].slot_name,
				id:   mappings[i].slot_id
			} : null
		}
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