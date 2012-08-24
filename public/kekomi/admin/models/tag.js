steal('can/model', 'can/observe/attributes', function(){

/**
 * @class Admin.Models.TemplateSlot
 * @parent index
 * @inherits can.Model
 * Wraps backend content services.  
 */
can.Model('Admin.Models.Tag',
/* @Static */
{
	findAll: "/tags",
	suggest : function(suggest, cb){
		Admin.Models.Tag.findAll({q: suggest.term}, function(tags){
			cb(tags.map(function(tag){
				return tag.id
			}))
		}, function(){
			cb([])
		})
	}
},
/* @Prototype */
{
	
});


})