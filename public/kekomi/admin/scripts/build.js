//steal/js admin/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('admin/scripts/build.html',{to: 'admin'});
});
