steal(
'admin/mvc.js', 
'admin/vendor/codemirror',
'steal/less').then(
'admin/vendor/codemirror/CodeMirror-2.33/mode/markdown',
'./markdown.less',
function(){
	can.Control('Admin.Content.Types.Atom.Markdown', {}, {
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
			this.editor = CodeMirror(this.element.find('.controls')[0], {
				lineNumbers: true,
				mode: 'markdown',
				onChange : this.proxy('saveData')
			});
			setTimeout(this.proxy(function(){
				this.editor.setValue(curVal || "")
			}), 1)
			
		},
		saveData : function(){
			this.options.model.attr(this.options.attr, this.editor.getValue())
		}
	})
})