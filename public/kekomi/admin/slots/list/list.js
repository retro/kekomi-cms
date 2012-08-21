steal(
'admin/mvc.js',
'steal/less'
).then('./list.less', function(){
	can.Control('Admin.Slots.List', {}, {
		init : function(){
			this.element.html(this.view('init'));
			Admin.Models.Slot.findAll({}, this.proxy('render'));
		},
		render : function(slots){
			this.element.find('.table-wrap').html(this.view('list', { 
				slots : slots
			}))
			if(slots.length > 0){
				new can.ui.TableScroll(this.element.find('table'));
			}
		}
	})
})