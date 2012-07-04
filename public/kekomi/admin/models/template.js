steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

var templatesCache;
var underscoredToHumanized = function(val){
	return val.classify().replace(/([A-Z])/g, " $1").substr(1);
}

/**
 * @class Admin.Models.Template
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.Template',
/* @Static */
{
	findAll : "/templates",
	preload : function(){
		return this.findAll({}, function(templates){
			templatesCache = templates;
		})
	},
	all : function(){
		return templatesCache;
	}
},
/* @Prototype */
{
	init : function(){
		this.attr('name', underscoredToHumanized(this.path));
	},
	getBehaviorsFor : function(contentType){
		var behaviors            = this.behaviors,
			contentTypeBehaviors = [],
			behavior, defaultTemplates, contentTypeTemplates;
		for(var i = 0; i < behaviors.length; i++){
			behavior              = { id: behaviors[i].id, url: behaviors[i].url, name: underscoredToHumanized(behaviors[i].id) };
			defaultTemplates      = behaviors[i].templates['*'] ? behaviors[i].templates['*'].serialize() : {};
			contentTypeTemplates  = behaviors[i].templates[contentType] ? behaviors[i].templates[contentType].serialize() : {};
			behavior["templates"] = $.extend({}, defaultTemplates, contentTypeTemplates);
			contentTypeBehaviors.push(behavior)
		}
		contentTypeBehaviors.get = function(behavior){
			for(var i = 0; i < this.length; i++){
				if(this[i].id === behavior){
					return this[i];
				}
			}
		}
		return contentTypeBehaviors;
	}
});

can.Model.List('Admin.Models.Template.List', {}, {
	getByPath : function(path){
		return this.grep(function(template){
			return template.path === path;
		})
	}
})

})