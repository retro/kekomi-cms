steal(
'admin/mvc.js',
'steal/less',
'admin/vendor/nested_sortable'
).then('./tree.less', function(){
	can.Control('Admin.Pages.Tree', {}, {
		init : function(){
			Admin.Models.Page.findAll({}, this.proxy('render'));
		},
		render : function(pages){
			this.pages = pages;
			this.element.html(this.view('init.ejs', {
				pages: pages
			})).addClass('has-header');
			this.element.find('.pages-wrapper ol:first').nestedSortable({
				handle: ".icon-reorder",
				items: "li",
				placeholder: 'placeholder',
				helper:	'original',
				forcePlaceholderSize: true,
				tolerance: 'pointer',
				toleranceElement: '> div'
			})
		},
		".remove-page click" : function(el, ev){
			var model = el.closest('li').model();
			if(confirm("Are you sure?")){
				model.destroy();
			}
		},
		"{Admin.Models.Page} created" : function(Page, ev, page){
			Admin.Models.Page.findAll({}, this.proxy('render'));
		},
		" sortstop" : function(el, ev, ui){
			var tree = this.element.find('.pages-wrapper ol:first').nestedSortable('toArray', {startDepthCount: 0}),
				page, parentId, pageModel, positions = {};
			for(var i = 0; i < tree.length; i++){
				page = tree[i];
				parentId = tree[i].parent_id;
				if(page.item_id === "root"){
					continue;
				}
				pageModel = this.pages.get(page.item_id)[0];
				positions[page.parent_id] = positions[page.parent_id] || 0;
				++positions[page.parent_id];
				if(parentId === "root"){
					parentId = null;
				}
				pageModel.attr({parent_id: parentId, position: (positions[page.parent_id] - 1)})
				pageModel.save();
			}
		}
	})
})