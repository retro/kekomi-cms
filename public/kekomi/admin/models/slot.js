steal('can/model', 'can/observe/attributes', function(){

/**
 * @class Admin.Models.Slot
 * @parent index
 * @inherits can.Model
 * Wraps backend slot services.  
 */
can.Model('Admin.Models.Slot',
/* @Static */
{
	findAll: "/slots",
	destroy : "/slots/{id}"
},
/* @Prototype */
{
	
});


})