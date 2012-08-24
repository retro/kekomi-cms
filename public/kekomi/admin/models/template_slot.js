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


})