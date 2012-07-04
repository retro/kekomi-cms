steal(
'admin/mvc.js',
'steal/less',
'jquery/dom/form_params',
'admin/util/form',
'admin/util',
'admin/vendor/base64'
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

	var getTemplatesAsArray = function(templatesHash){
		var templates = []
		for(var k in templatesHash){
			if(templatesHash.hasOwnProperty(k)){
				templates.push(templatesHash[k])
			}
		}
		return templates;
	}

	can.Control('Admin.Pages.Form', {}, {
		init : function(){
			if(typeof this.options.page.attr('behaviors') === "undefined"){
				this.options.page.attr('behaviors', {});
			}
			$.when(Admin.Models.Page.findAll({}), Admin.Models.Template.findAll({})).then(this.proxy("render"))
		},
		render : function(pages, templates){
			this.templates = templates[0];
			this.pages     = pages[0];

			/*this.options.page.attr("section_content_type", "article")
			this.options.page.attr("template", "news_inside")*/

			this.template =Admin.Models.Template.all().getByPath(this.options.page.template)[0]

			this.element.html(this.view('init', {
				page          : this.options.page,
				tree          : renderTree(this.pages),
				templates     : this.templates,
				content_types : Admin.Models.ContentType.all()
			})).addClass('paper-form');
			this.element.find('form').admin_util_form({
				model: this.options.page
			})
			this.updatePath(this.options.page.slug);
			this.showBehaviors()
		},
		"form saved" : function(el, ev){
			can.route.attr({type: "pages", action: "list"})
		},
		'.behavior-toggle change' : function(el, ev){
			var behavior;
			if(el.is(':checked')){
				behavior = this.template.getBehaviorsFor(this.element.find("#page_section_content_type").val()).get(el.data('behavior'));
				console.log(behavior)
				el.closest('.behavior').find('.templates').html(this.view('templates.ejs', {
					behavior: behavior,
					path: this.calculatePath(this.element.find('#page_slug').val()),
					slots: Admin.Models.TemplateSlot.findAll({ids: getTemplatesAsArray(behavior.templates)})
				})).show()
			} else {
				el.closest('.behavior').find('.templates').html("").hide()
			}
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
		"#page_section_content_type change" : function(el){
			var val = el.val();
			if(typeof val === "undefined" || val === ""){
				this.options.page.removeAttr("section_content_type");
			} else {
				this.options.page.attr("section_content_type", val)
			}
			this.showBehaviors();
		},
		"#page_template change" : function(el, ev){
			var val = el.val();
			if(typeof val === "undefined" || val === ""){
				delete this.template;
				this.options.page.removeAttr("template");
				this.element.find(".behaviors-wrapper").html();
			} else {
				this.template = Admin.Models.Template.all().getByPath(val)[0];
				this.options.page.attr("template", val)
				this.showBehaviors()
			}
		},
		".enable-page-content change" : function(el, ev){
			this.element.find('.page-content-type-wrap').toggle(el.is(":checked"));
		},
		".enable-acts-as-section change" : function(el, ev){
			var checked = el.is(":checked");
			this.element.find('.content-section-wrap').toggle(checked);
			if(!checked){
				this.element.find("#page_section_content_type").val("").trigger("change");
			}
		},
		showBehaviors : function(path){
			if(typeof this.template === "undefined") return;
			path = path || this.calculatePath(this.element.find("#page_slug").val())
			this.element.find('.behaviors-wrapper').html(this.view(
				'behaviors.ejs', 
				{
					behaviors: this.template.getBehaviorsFor(this.element.find("#page_section_content_type").val()),
					path : path,
					page : this.options.page
				}
			))
		},
		calculatePath : function(slug){
			if(slug === ""){
				slug = "<page-slug>"
			}
			return "/" + calculatePath(this.pages, this.element.find('#page_parent_id').val(), slug);
		},
		updatePath : function(slug){
			var path = this.calculatePath(slug);
			this.element.find('.calculated-path span').text(path);
			this.element.find('.behavior-path .path').text(path);
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