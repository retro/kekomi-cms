steal(
'admin/mvc.js',
'admin/asset_manager/uploader',
'steal/less'
).then('./asset_manager.less', function(){
	can.Control('Admin.AssetManager', {}, {
		init : function(){
			this.element.html(this.view("init.ejs"))
		}
	})
})