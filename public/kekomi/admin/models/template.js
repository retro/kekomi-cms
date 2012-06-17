steal('can/model', 'can/observe/validations', 'can/model/list', 'can/model/elements', function(){

/**
 * @class Admin.Models.Template
 * @parent index
 * @inherits can.Model
 * Wraps backend page services.  
 */
can.Model('Admin.Models.Template',
/* @Static */
{
	findAll : "/templates"
},
/* @Prototype */
{

});

can.Model.List('Admin.Models.Template.List', {}, {
	getByPath : function(path){
		return this.grep(function(template){
			return template.path === path;
		})
	}
})

})