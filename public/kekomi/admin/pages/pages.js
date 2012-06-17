steal(
'admin/mvc.js',
'admin/pages/form',
'steal/less',
'admin/vendor/nested_sortable'
).then('./pages.less', './views/leaf.ejs', function(){8
	can.Control('Admin.Pages', {}, {
		init : function(){
			Admin.Models.Page.findAll({}, this.proxy('render'));
		},
		render : function(pages){
			this.pages = pages;
			this.element.html(can.view.render('//admin/pages/views/init.ejs', {
				tree: renderTree(pages),
				pages: pages
			})).addClass('has-header');
			this.hookupModels();
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
		".add-page click" : function(){
			$('<div/>').admin_pages_form({
				page: new Admin.Models.Page
			});
		},
		".edit-page click" : function(el){
			$('<div/>').admin_pages_form({
				page: el.closest('li').model()
			});
		},
		".remove-page click" : function(el, ev){
			var model = el.closest('li').model();
			if(confirm("Are you sure?")){
				model.destroy();
			}
		},
		hookupModels : function(){
			var lis, id, li;
			lis = this.element.find('.pages-wrapper li');
			for(var i = 0; i < lis.length; i++){
				li = $(lis[i]);
				id = li.data().id;
				this.pages.get(id)[0].hookup(li);
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
	var renderTree = function(pages, id){
		id = id || "_";
		var html = [], leafPages = pages.childrenOf(id);
		if(leafPages.length > 0){
			html.push('<ol class="unstyled">');
			for(var i = 0; i < leafPages.length; i++){
				html.push('<li data-id="' + leafPages[i].id + '" + id="page-' + leafPages[i].id + '">')
				html.push(can.view.render("//admin/pages/views/leaf.ejs", {page: leafPages[i]}));
				html.push(renderTree(pages, leafPages[i].id));
				html.push('</li>');
			}
			html.push('</ol>');
		}
		return html.join("");
	}
})