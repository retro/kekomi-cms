steal(
'admin/mvc.js',
'admin/asset_manager/uploader',
'canui/selectable',
'steal/less',
'jquery/event/key',
'jquery/dom/dimensions'
).then('./asset_manager.less', function(){

	var icons = {
		video: "icon-film",
		audio: "icon-headphones",
		image: "icon-pictures"
	}

	var calculateAssetsPerRow = function(asset){
		var assetWidth = asset.outerWidth(true);
		var containerWidth = this.element.find('.asset-list').width();
		return Math.floor(containerWidth / assetWidth);
	}

	can.Control('Admin.AssetManager', {}, {
		init : function(){
			Admin.Models.Asset.findAll({}, this.proxy('render'))
		},
		render : function(assets){
			this.assets = assets;
			this.element.html(this.view("init.ejs", {
				assets: assets,
				icons: icons
			}))
			new can.ui.Selectable(this.element)
		},
		".delete click" : function(el, ev){
			ev.stopImmediatePropagation();
			this.element.find('.activated').not(el.closest('.asset')).removeClass('activated')
			if(confirm("Are you sure?")){
				el.closest('.asset').model().destroy();
			}
		},
		keydown : function(el, ev){
			var keys = "left right up down".split(" ");
			var key  = ev.keyName();
			var activated = this.element.find('.activated');
			var index, assets, assetsPerRow, newIndex;
			if(keys.indexOf(key) > -1 && activated.length > 0){
				activated = activated.eq(0);
				assets    = this.element.find('.asset');
				index     = assets.index(activated);
				if(key === "left"){
					newIndex = index - 1;
				} else if(key === "right"){
					newIndex = index + 1;
				} else if(key === "up"){
					assetsPerRow = calculateAssetsPerRow.call(this, activated);
					newIndex = index - assetsPerRow;
				} else if(key === "down"){
					assetsPerRow = calculateAssetsPerRow.call(this, activated);
					newIndex = index + assetsPerRow;
				}
				if(newIndex < 0) newIndex = 0;
				if(newIndex > assets.length - 1) newIndex = assets.length - 1;
				console.log(newIndex, index)
				if(newIndex !== index){
					activated.trigger('deactivate')
					assets.eq(newIndex).trigger('activate')
				}
			}
		},
		".thumb img mousedown" : function(el, ev){
			ev.preventDefault();
		},
		"{Admin.Models.Asset} created" : function(Asset, ev, asset){
			this.assets.unshift(asset);
		}
	})
});