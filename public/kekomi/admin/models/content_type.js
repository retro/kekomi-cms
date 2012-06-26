steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var contentTypesCache;

/**
 * @class Admin.Models.ContentType
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.ContentType',
/* @Static */
{
	findAll : "/content_types",
	preload : function(){
		return this.findAll({}, function(contentTypes){
			contentTypesCache = contentTypes;
			for(var i = 0; i < contentTypes.length; i++){
				can.Model('Admin.Models.ContentTypes.' + contentTypes[i].name.replace(/ /g, ''), {}, {})
			}
		})
	},
	all : function(){
		return contentTypesCache;
	}
},
/* @Prototype */
{
	contentTypeModel : function(){
		return Admin.Models.ContentTypes[this.name.replace(/ /g, '')]
	}
});


})