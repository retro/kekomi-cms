steal(
'admin/mvc.js', 
'admin/vendor/redactor',
'steal/less').then(
'./rte.less',
function(){
	can.Control('Admin.Content.Types.Atom.Rte', {}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === "undefined" || curVal === null){
				this.options.model.attr(this.options.attr, "")
			}
			this.element.html(this.view("init", {
				model : this.options.model,
				attr : this.options.attr,
				collection: this.options.collection,
				field: this.options.field
			}))
			this.editorEl = this.element.find('.editor').redactor({
				buttons : ['formatting', '|', 'bold', 'italic', 'deleted', '|',
							'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
							'table', 'link', '|',
							'fontcolor', 'backcolor', '|',
							'alignleft', 'aligncenter', 'alignright', 'justify', '|']
			})
		},
		'.editor blur' : function(){
			this.options.model.attr(this.options.attr, this.editorEl.getCode());
		},
		".editor mousedown" : function(el, ev){
			ev.stopPropagation();
		}
	})
})