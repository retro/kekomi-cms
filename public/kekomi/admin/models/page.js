steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

/**
 * @class Admin.Models.Page
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.Page',
/* @Static */
{
	findAll : "/pages",
	findOne : "/pages/{id}", 
	create  : "/pages",
	update  : "/pages/{id}",
	destroy : "/pages/{id}",
	validations : {},
	init : function(){
		this.validatePresenceOf(['name', 'slug']);
	}
},
/* @Prototype */
{
	serialize : function(){
		var serialized = this._super();
		delete serialized.parent_ids;
		if(serialized.parent_id === null){
			serialized.parent_id = "";
		}
		return serialized;
	},
	hasBehaviors : function(){
		return !$.isEmptyObject(this.attr('behaviors').attr())
	},
	hasSectionContentType : function(){
		return this.section_content_type !== "";
	}
});

var buildByParentId = function(){
	var page, i, parentId;
	this._byParentId = {};
	for(i = 0; i < this.length; i++){
		page     = this[i];
		parentId = page.parent_ids[page.parent_ids.length - 1] || "_";
		if(typeof this._byParentId[parentId] === "undefined"){
			this._byParentId[parentId] = [];
		}
		this._byParentId[parentId].push(page);
	}
}

can.Model.List('Admin.Models.Page.List', {}, {
	childrenOf : function(id){
		id = id || "_";
		if(typeof this._byParentId === "undefined"){
			buildByParentId.call(this)
		}
		return this._byParentId[id] || [];
	},
	parentsOf : function(page){
		var parents = [];
		for(var i = 0; i < page.parent_ids.length; i++){
			parents.push(this.get(page.parent_ids[i])[0])
		}
		return parents.reverse();
	}
})

var push = Admin.Models.Page.List.prototype.push;

Admin.Models.Page.List.prototype.push = function(){
	delete this._byParentId;
	push.apply(this, arguments);
}

})