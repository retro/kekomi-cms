steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var contentTypesCache;

var generateContentTypeClass = function(contentType, isPageContent){
	var modelName, modelEndpoint, match, actions = {};
	isPageContent = isPageContent || false;
	modelName     = contentType.name.replace(/ /g, '');
	if(isPageContent === true){
		match = modelName.match(/PageContent(\w+)Behavior(\w+)$/);
		modelEndpoint = 'page/behaviors/' + match[2] + "/" + match[1].underscore();
		actions = {
			findOne : "/content/" + modelEndpoint, 
			update  : "/content/" + modelEndpoint
		}
	} else {
		modelEndpoint = modelName.underscore(); // AdminTest => admin_test
		actions = {
			findAll : "/content/" + modelEndpoint,
			findOne : "/content/" + modelEndpoint + "/{id}", 
			create  : "/content/" + modelEndpoint,
			update  : "/content/" + modelEndpoint + "/{id}",
			destroy : "/content/" + modelEndpoint + "/{id}",
			representedWith: contentType.represented_with
		}
	}
	

	return can.Model('Admin.Models.ContentTypes.' + modelName, $.extend(actions, {
		humanizedName : function(){
			var match = this._shortName.match(/page_content_(\w+)_behavior/);
			if(match !== null){
				return match[1].humanize();
			}
			return this._shortName.humanize();
		}})
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
			return data;
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
	pageContentTypes : function(pageId, success){
		return $.get("/content_types/" + pageId, function(contentTypes){
			contentTypes = Admin.Models.ContentType.models(contentTypes)
			for(var i = 0; i < contentTypes.length; i++){
				generateContentTypeClass(contentTypes[i], true)
			}
			success(contentTypes);
		}, 'json');
	}
},
/* @Prototype */
{
	contentTypeModel : function(){
		return Admin.Models.ContentTypes[this.name.replace(/ /g, '')]
	}
});


})