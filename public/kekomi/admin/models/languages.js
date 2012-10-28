steal('can/model', 'can/observe/attributes', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var languagesCache;

/**
 * @class Admin.Models.ContentType
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.Languages',
/* @Static */
{
	findAll : "/languages",
	preload : function(){
		return this.findAll({}, function(languages){
			languagesCache = languages;
		})
	},
	all : function(){
		return languagesCache;
	}
},
/* @Prototype */
{

});



})