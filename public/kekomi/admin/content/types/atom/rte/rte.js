steal(
'admin/mvc.js', 
'admin/vendor/ckeditor',
'steal/less').then(
'./rte.less',
function(){
	can.Control('Admin.Content.Types.Atom.Rte', {}, {
		init : function(){
			//console.log(this.options.attr)
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
			this.editor = CKEDITOR.inline(this.element.find('.editor')[0], {
				enterMode : CKEDITOR.ENTER_P,
				toolbar   : [
					{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
					{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
					{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote' ] },
					{ name: 'styles', items : [ 'Format' ] },
					{ name: 'insert', items : [ 'Table' ] }
				],
				on : {
					blur : this.proxy('setData')
				}
			})
		},
		setData : function(){
			this.options.model.attr(this.options.attr, this.editor.getData());
		},
		" mousedown" : function(el, ev){
			ev.stopPropagation();
		}
	})
})