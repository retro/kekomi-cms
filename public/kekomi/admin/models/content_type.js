steal('can/model', 'can/observe/attributes', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var contentTypesCache;

var generateContentTypeClass = function(contentType, isPageContent){
	var modelName, modelEndpoint, match, nameParts = [], actions = {};
	isPageContent = isPageContent || false;


	modelName = contentType.name.replace(/ /g, '');
	
	if(isPageContent === false){
		modelEndpoint = modelName.underscore(); // AdminTest => admin_test
		actions = {
			findAll : "/content/" + modelEndpoint,
			findOne : "/content/" + modelEndpoint + "/{id}", 
			create  : "/content/" + modelEndpoint,
			update  : "/content/" + modelEndpoint + "/{id}",
			destroy : "/content/" + modelEndpoint + "/{id}",
			representedWith: contentType.represented_with
		}
	} else {
		actions = {
			behavior: contentType.behavior
		}
	}
	

	return can.Model('Admin.Models.ContentTypes.' + modelName, $.extend(actions, {
		humanizedName : function(){
			return this._shortName.humanize();
		},
		contentTypeDefinition : function(){
			var self = this;
			return $.grep(contentTypesCache, function(contentType){
				return contentType.name === self.shortName;
			})[0];
		}
	})
	, {
		init : function(){
			if(this.isNew() && !isPageContent){
				this.attr('is_published', false);
				this.attr('published_at', (new Date()))
			}
			this.attr('isPageContent', isPageContent)
		},
		serialize : function(){
			var data = this._super.apply(this, arguments);
			delete data.representation;
			delete data.isPageContent;
			return data;
		},
		tagsArray : function(){
			return this.tags.split(',');
		}
	})
}

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
				generateContentTypeClass(contentTypes[i]);
			}
		})
	},
	all : function(){
		return contentTypesCache;
	},
	templateContentTypes : function(folder, type){
		var url = can.sub("/content_types/{folder}/{type}", {folder: folder, type: type});
		return $.ajax(url, {
			dataType: "templatecontenttypes",
			converters: {
				"json templatecontenttypes": function(data){
					var types = [];
					for(var i = 0; i < data.data.length; i++){
						contentTypesCache.push(Admin.Models.ContentType.model(data.data[i]))
						types.push(generateContentTypeClass(data.data[i], true))
					}
					return types;
				}
			}
		})

	}
},
/* @Prototype */
{
	contentTypeModel : function(){
		return Admin.Models.ContentTypes[this.name.replace(/ /g, '')]
	}
});


})