steal(
'admin/mvc.js',
'steal/less',
'admin/slots/list',
'admin/slots/form',
function(){
	can.Control('Admin.Slots', {}, {
		init : function(){
			this.element.html(this.view("init.ejs")).addClass('has-header')
			this.handleRouting()
		},
		"{can.route} type change" : "handleRouting",
		"{can.route} action change" : "handleRouting",
		handleRouting : function(){
			if(can.route.attr('type') === "slots"){
				clearTimeout(this._action);
				this._action = setTimeout(this.proxy(this[can.route.attr('action') + "Action"]), 1);
			}
			
		},
		listAction : function(){
			var div = $('<div/>').admin_slots_list();
			this.element.find('.module-content').html(div);
		},
		newAction : function(){
			this.element.find('.module-content').html($('<div/>').admin_slots_form({
				slot: new Admin.Models.Slot
			}));
		}/*,
		editAction : function(){
			Admin.Models.Page.findOne({id: can.route.attr('id')}, this.proxy(function(page){
				this.element.find('.module-content').html($('<div/>').admin_pages_form({
					page: page
				}));
			}))
		},
		contentAction : function(){
			Admin.Models.Page.findOne({id: can.route.attr('id')}, this.proxy(function(page){
				this.element.find('.module-content').html($('<div/>').admin_pages_content({
					page: page
				}));
			}))
			
		}*/
	})
})