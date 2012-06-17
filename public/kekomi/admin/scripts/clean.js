//steal/js admin/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/clean',function(){
	steal.clean('admin/admin.html',{indent_size: 1, indent_char: '\t'});
});
