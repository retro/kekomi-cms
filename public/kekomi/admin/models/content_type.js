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
			var modelName, modelEndpoint;
			contentTypesCache = contentTypes;
			for(var i = 0; i < contentTypes.length; i++){

				modelName     = contentTypes[i].name.replace(/ /g, '');
				modelEndpoint = modelName.underscore(); // AdminTest => admin_test

				can.Model('Admin.Models.ContentTypes.' + modelName, {
					findAll : "/content/" + modelEndpoint,
					findOne : "/content/" + modelEndpoint + "/{id}", 
					create  : "/content/" + modelEndpoint,
					update  : "/content/" + modelEndpoint + "/{id}",
					destroy : "/content/" + modelEndpoint + "/{id}",
					representedWith: contentTypes[i].represented_with
				}, {
					init : function(){
						if(this.isNew()){
							this.attr('is_published', false);
							this.attr('published_at', (new Date()))
						}
					},
					serialize : function(){
						var data = this._super.apply(this, arguments);
						delete data.representation;
						return data;
					}
				})
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