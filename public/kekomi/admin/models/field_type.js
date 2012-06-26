steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var fieldTypesCache;

/**
 * @class Admin.Models.ContentType
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.FieldType',
/* @Static */
{
	findAll : "/field_types",
	preload : function(){
		return this.findAll({}, function(fieldTypes){
			fieldTypesCache = fieldTypes;
		})
	},
	all : function(){
		return fieldTypesCache;
	}
},
/* @Prototype */
{

});


})