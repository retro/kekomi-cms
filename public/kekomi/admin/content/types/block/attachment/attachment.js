steal(
'admin/mvc.js',
'steal.less'
).then(
'./attachment.less',
function(){

	can.Control('Admin.Content.Types.Block.Attachment', {}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === 'undefined' || curVal === null){
				this.options.model.attr(this.options.attr, {});
			}
			this.element.html(this.view('init', {
				fieldType: this.options.fieldType,
				model : this.options.model,
				attr : this.options.attr,
				collection: this.options.collection
			}))
		},
		'.select-attachment click' : function(){
			this.options.fileBrowser = $('<div class="modal asset-manager-modal"></div>').html(this.view('modal')).modal({
				show: true,
				backdrop: false
			})
			this.on();
		},
		'.remove-attachment click' : function(){
			this.options.model.attr(this.options.attr, {})
		},
		'{fileBrowser} .insert-attachment click' : function(el, ev){
			ev.stopPropagation();
			var attachment = el.closest('.modal').find('.asset.activated:first');
			if(attachment.length > 0){
				this.setAttachment(attachment.model());
				el.closest('.modal').modal('hide')
			}
		},
		'{fileBrowser} .asset dblclick' : function(el, ev){
			ev.stopPropagation();
			this.setAttachment(el.model());
			el.closest('.modal').modal('hide')
		},
		setAttachment : function(attachment){
			this.options.model.attr(this.options.attr, {
				url : attachment.url,
				name: attachment.url.split('/').pop().titleize().split('.').shift(),
				mime_type: attachment.mime_type,
				size: attachment.size
			})
		},
		"input[type=text] change" : function(el, ev){
			this.options.model.attr(this.options.attr + '.name', el.val());
		},
		value : function(){
			return this.options.model.attr(this.options.attr).serialize();
		}
	})
})