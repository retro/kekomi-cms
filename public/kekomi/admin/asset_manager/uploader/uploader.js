steal(
'admin/mvc.js',
'admin/vendor/file_upload',
'steal/less',
'admin/util'
).then('./uploader.less', function(){

	var Upload = can.Model({}, {})
	var progress = function(data){
		return parseInt(data.loaded / data.total * 100, 10);
	}

	can.Control('Admin.AssetManager.Uploader', {
		defaults : {
			notice : $('#dragover-notice'),
			uploader : new can.Observe({
				progress : 0,
				uploads : new Upload.List
			})
		}
	}, {
		init : function(){
			this.element.html(this.view("init.ejs", {
				uploader: this.options.uploader
			}))
			this.element.find('.fileupload').fileupload({
				dataType: 'json'
			})
		},
		".fileupload fileuploaddragover": function(el,ev){
			this.options.notice.fadeIn(200);
			clearTimeout(this._hideNoticeTimeout);
			this._hideNoticeTimeout = setTimeout(this.proxy('hideNotice'), 100)
		},
		".fileupload fileuploaddrop" : function(el, ev){
			this.hideNotice();
		},
		".fileupload fileuploadadd" : function(el, ev, data){
			var id;
			for(var i = 0; i < data.files.length; i++){
				id = uuid();
				this.options.uploader.uploads.push(new Upload({
					filename: data.files[i].name,
					id: id
				}))
				data.files[i].id = id;
			}
		},
		".fileupload fileuploaddone" : function(el, ev, data){
			for(var i = 0; i < data.files.length; i++){
				this.options.uploader.uploads.remove(data.files[i].id);
			}
		},
		".fileupload fileuploadprogress" : function(el, ev, data){
			for(var i = 0; i < data.files.length; i++){
				var upload = this.options.uploader.uploads.get(data.files[i].id)[0];
				upload.attr('progress', progress(data));
			}
		},
		".fileupload fileuploadprogressall" : function(el, ev, data){
			this.options.uploader.attr('progress', progress(data));
		},
		hideNotice : function(){
			this.options.notice.fadeOut(200);
		}
	})
})