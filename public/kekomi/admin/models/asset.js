steal('can/model', 'can/observe/attributes', function(){

/**
 * @class Admin.Models.Asset
 * @parent index
 * @inherits can.Model
 * Wraps backend asset services.  
 */
can.Model('Admin.Models.Asset',
/* @Static */
{
	findAll: "/assets",
	destroy : "/assets/{id}"
},
/* @Prototype */
{
	
});


})