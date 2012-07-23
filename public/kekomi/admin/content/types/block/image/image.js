steal(
'admin/mvc.js',
'steal.less'
).then(
'./image.less',
function(){

	var gravityLabels = {
		n: "North",
		nw: "North West",
		ne: "North East",
		w: "West",
		c: "Center",
		e: "East",
		s: "South",
		sw: "South West",
		se: "South East"
	}


	var makeThumbUrl = function(url){
		var urlArr   = url.split('/');
		urlArr[urlArr.length - 1] = "thumb_" + urlArr[urlArr.length - 1];
		return urlArr.join('/');
	}

	can.Control('Admin.Content.Types.Block.Image', {}, {
		init : function(){
			var curVal = this.options.model.attr(this.options.attr);
			if(typeof curVal === 'undefined' || curVal === null){
				this.options.model.attr(this.options.attr, {});
			}
			this.element.html(this.view('init', {
				fieldType: this.options.fieldType,
				model : this.options.model,
				attr : this.options.attr,
				collection: this.options.collection,
				gravities: [["nw", "n", "ne"], ["w", "c", "e"], ["sw", "s", "se"]],
				gravityLabels: gravityLabels
			}))
			if(this.options.model.attr(this.options.attr)){
				this.markActiveGravity();
			}
		},
		'.select-image click' : function(){
			this.options.imageBrowser = $('<div class="modal asset-manager-modal"></div>').html(this.view('modal')).modal({
				show: true,
				backdrop: false
			})
			this.on();
		},
		'.remove-image click' : function(){
			this.options.model.attr(this.options.attr, {})
		},
		'{imageBrowser} .insert-image click' : function(el, ev){
			ev.stopPropagation();
			var image = el.closest('.modal').find('.asset.activated:first');
			if(image.length > 0){
				this.setImage(image.model());
				el.closest('.modal').modal('hide')
			}
		},
		'{imageBrowser} .asset dblclick' : function(el, ev){
			ev.stopPropagation();
			this.setImage(el.model());
			el.closest('.modal').modal('hide')
		},
		".gravity td click" : function(el, ev){
			this.element.find('.gravity .selected').removeClass('selected')
			el.addClass('selected')
			this.options.model.attr(this.options.attr + ".gravity", el.data('gravity'))
		},
		markActiveGravity : function(){
			this.element.find("td[data-gravity="+this.options.model.attr(this.options.attr+".gravity")+"]").addClass('selected')
		},
		setImage : function(image){
			console.log(this.options.model.attr(this.options.attr), this.options.attr)
			this.options.model.attr(this.options.attr, {
				caption: "",
				gravity: "c",
				url : image.url,
				width: image.width,
				height: image.height
			})
			this.markActiveGravity();
			console.log(this.options.model, this.options.model.attr(this.options.attr), this.options.attr)
		},
		value : function(){
			return this.options.model.attr(this.options.attr).serialize();
		}
	})
})