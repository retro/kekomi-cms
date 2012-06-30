steal(
'admin/mvc.js',
'steal/less',
'jquery/dom/form_params',
'admin/util/form',
'admin/util'
).then('./form.less', function(){

	var calculatePath = function(pages, parentId, slug){
		var slugArray = [slug];
		if(parentId !== ""){
			var parent  = pages.get(parentId)[0];
			var parents = pages.get.apply(pages, parent.attr('parent_ids'))
			slugArray.unshift(parent.attr('slug'));
			while(parents.length > 0){
				parent = parents.pop()
				slugArray.unshift(parent.attr('slug'));
			}
		}
		return slugArray.join('/').replace(/\/+/g, '/');
	}

	can.Control('Admin.Pages.Form', {}, {
		init : function(){
			$.when(Admin.Models.Page.findAll({}), Admin.Models.Template.findAll({})).then(this.proxy("render"))
		},
		render : function(pages, templates){
			this.templates = templates[0];
			this.pages     = pages[0];
			this.element.html(this.view('init', {
				page      : this.options.page,
				tree      : renderTree(this.pages),
				templates : this.templates
			})).addClass('paper-form')
			this.element.find('form').admin_util_form({
				model: this.options.page
			})
		},
		"form saved" : function(el, ev){
			
		},
		'#page_name change' : function(el, ev){
			var slug = Admin.Util.slugify(el.val());
			this.element.find('#page_slug').val(slug);
			this.updatePath(slug);
		},
		"#page_parent_id change" : function(){
			this.updatePath(this.element.find('#page_slug').val())
		},
		"#page_slug change" : function(){
			this.updatePath(this.element.find('#page_slug').val())
		},
		updatePath : function(slug){
			if(slug === ""){
				slug = "&lt;page slug&gt;"
			}
			var path = calculatePath(this.pages, this.element.find('#page_parent_id').val(), slug);
			this.element.find('.calculated-path').html("<b>Full path:</b> /" + path);
		},

		" hidden" : function(){
			this.element.remove();
		}
	})
	var renderTree = function(pages, id){
		id = id || "_";
		var html = [], leafPages = pages.childrenOf(id);
		for(var i = 0; i < leafPages.length; i++){
			html.push('<option value="' + leafPages[i].id + '">' + Array(leafPages[i].parent_ids.length + 2).join('-') + " " + leafPages[i].name + '</option>')
			html.push(renderTree(pages, leafPages[i].id));
		}
		return html.join("");
	}
})