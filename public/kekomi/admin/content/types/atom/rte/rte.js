steal(
'admin/mvc.js', 
'admin/vendor/hallo',
'steal/less').then(
'./rte.less',
function(){
	can.Control('Admin.Content.Types.Atom.Rte', {}, {
		init : function(){
			//console.log(this.options.attr)
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined"){
				this.options.model.attr(this.options.attr, "")
			}
			this.element.html(this.view("init", {
				model : this.options.model,
				attr : this.options.attr,
				collection: this.options.collection,
				field: this.options.field
			}))
			this.element.find('.editor').hallo({
				showAlways : true,
				floating: true,
				plugins: {
					'halloformat': {},
					'halloheadings': {},
					'hallolists': {}
				}
			})
		},
	})
})