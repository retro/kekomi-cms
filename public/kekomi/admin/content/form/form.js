steal(
'admin/mvc.js',
'admin/content/types/atom',
'admin/content/types/block',
'admin/content/types/collection',
'admin/content/types/compound',
'admin/vendor/jqueryui',
'admin/vendor/timepicker',
'admin/vendor/tagit',
'steal/less',
'./helper.js'
).then('./form.less', function(){
	can.Control('Admin.Content.Form', {
		save : function(){
			this.options.model.save();
		}
	}, {
		init : function(){
			$.when(Admin.Models.Page.findAll({})).then(this.proxy('render'));
		},
		render : function(pages){
			this.pages = pages
			this.element.html(this.view('init.ejs', {
				contentType : this.options.contentType,
				model       : this.options.model,
				pagesTree   : renderTree(this.pages)
			})).addClass('paper-form')
			var datetimepicker = this.element.find('.publish-date-time input').datetimepicker();
			if(this.options.model.isNew()){
				datetimepicker.datetimepicker('setDate', (new Date()))
			}
			this.element.find('.tags-input').tagit({
				allowSpaces: true,
				tagSource : Admin.Models.Tag.suggest
			})
		},
		".publish-date-time .icon-calendar click" : function(el, ev){
			el.siblings('input').focus();
		},
		".publish-date-time input keydown" : function(el, ev){
			ev.preventDefault();
		},
		"form submit" : function(el, ev){
			ev.preventDefault();
			//console.log(this.options)
			this.options.save.apply(this);
		}
	})
	var renderTree = function(pages, id){
		id = id || "_";
		var html = [], leafPages = pages.childrenOf(id), isSectionForContentType, indent;
		for(var i = 0; i < leafPages.length; i++){
			isSectionForContentType = can.route.attr('content_type') === leafPages[i].section_content_type;
			indent = Array(leafPages[i].parent_ids.length + 2).join('-');
			html.push('<option value="' + leafPages[i].id + '"' + (!isSectionForContentType ? " disabled" : "") + '>' + indent + " " + leafPages[i].name + '</option>')
			html.push(renderTree(pages, leafPages[i].id));
		}
		return html.join("");
	}
})