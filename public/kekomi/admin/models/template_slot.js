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