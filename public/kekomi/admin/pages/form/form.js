steal(
'admin/mvc.js',
'steal/less',
'jquery/dom/form_params',
'admin/util/form',
'admin/util',
'admin/pages/form/slots'
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
			})).addClass('modal').modal({
				show: true
			})
			this.element.find('form').admin_util_form({
				model: this.options.page
			})
			this.showSlots();
			this.center();
		},
		"form saved" : function(el, ev){
			this.element.modal('hide');
		},
		'#page_name change' : function(el, ev){
			var slug = Admin.Util.slugify(el.val());
			this.element.find('#page_slug').val(slug);
			this.updatePath(slug);
		},
		"#page_template change" : function(el, ev){
			this.showSlots();
		},
		"#page_parent_id change" : function(){
			this.updatePath(this.element.find('#page_slug').val())
		},
		showSlots : function(el){
			el = el || this.element.find('#page_template');
			var slots = this.element.find('.slots');
			var val   = el.val();
			slots.empty();
			if(val != ""){
				slots.html(this.view('slots', {
					template: this.templates.getByPath(val)[0]
				}))
			}
		},
		updatePath : function(slug){
			if(slug === ""){
				slug = "&lt;page slug&gt;"
			}
			var path = calculatePath(this.pages, this.element.find('#page_parent_id').val(), slug);
			this.element.find('.calculated-path').html("<b>Full path:</b> /" + path);
		},
		center : function(){
			this.element.css({
				marginTop : "-" + (this.element.height() / 2) + "px",
				marginLeft : "-" + (this.element.width() / 2) + "px"
			})
		},
		" hidden" : function(){
			this.element.remove();
		},
		"{window} resize" : "center"
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