steal('can/model', 'can/observe/attributes', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){


/**
 * @class Admin.Models.Template
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.Template',
/* @Static */
{
	findAll : "/templates/{group}/{type}"
},
/* @Prototype */
{
});


})