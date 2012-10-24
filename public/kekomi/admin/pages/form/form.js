steal(
'admin/mvc.js',
'steal/less',
'jquery/dom/form_params',
'admin/util/form',
'admin/util',
'admin/vendor/base64',
'admin/vendor/chosen',
'jquery/event/hover'
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

	var renderTree = function(pages, id){
		id = id || "_";
		var html = [], leafPages = pages.childrenOf(id);
		for(var i = 0; i < leafPages.length; i++){
			html.push('<option value="' + leafPages[i].id + '">' + Array(leafPages[i].parent_ids.length + 2).join('-') + " " + leafPages[i].name + '</option>')
			html.push(renderTree(pages, leafPages[i].id));
		}
		return html.join("");
	}

	var cleanRouteUrl = function(hash, removeAttrs){
		var attrs = can.route.attr();
		for(var i = 0; i < removeAttrs.length; i++){
			delete attrs[removeAttrs[i]];
		}
		return can.route.url($.extend(attrs, hash));
	}

	can.Control('Admin.Pages.Form', {}, {
		init : function(){
			window.page = this.options.page
			$.when(Admin.Models.Page.findAll({}), 
				   Admin.Models.NodeType.findAll({}), 
				   Admin.Models.TemplateGroup.findAll({})).then(this.proxy("render"))
		},
		render : function(nodes, nodeTypes, templateGroups){
			nodes          = nodes[0];
			nodeTypes      = nodeTypes[0];
			templateGroups = templateGroups[0];

			this.element.html(this.view('init', {
				page           : this.options.page,
				tree           : renderTree(nodes),
				nodeTypes      : nodeTypes,
				templateGroups : templateGroups
			})).addClass('paper-form');

			this.element.find('form').admin_util_form({
				model: this.options.page
			})

			if(!H.isBlank(this.options.page.template_group)){
				this.element.find('.template-group-wrap').show();
				this.loadTemplates();
			}
		},
		'#page_node_type change' : 'loadTemplates',
		'#page_template_group change' : 'loadTemplates',
		loadTemplates : function(){
			this.type = this.element.find('#page_node_type').val();
			this.templateGroup = this.element.find('#page_template_group').val();
			if(this.type === "link"){
				this.element.find('.template-group-wrap').hide();
				this.element.find('.content-slots-categories').html(this.view('link_type'));
			} else {
				this.element.find('.content-slots-categories').empty();
				if(this.type !== "" && this.templateGroup === ""){
					this.element.find('.template-group-wrap').show();
				} else if(this.type !== "" && this.templateGroup !== ""){
					$.when(Admin.Models.ContentType.templateContentTypes(this.templateGroup, this.type), {}).then(this.proxy('renderTemplates'))
				} else {
					this.element.find('.template-group-wrap').hide();
				}
			}
			
		},
		renderTemplates: function(behaviors, slots){
			if(this.type === "page"){
				var contentTypeName = "TemplateContentType0" + this.templateGroup.classify() + "0Page0Page";
				var contentType     = $.grep(Admin.Models.ContentType.all(), function(contentType){
					return contentType.name === contentTypeName
				})[0];
				this.element.find('.content-slots-categories').html(this.view('page_type', {
					model: Admin.Models.ContentTypes[contentTypeName],
					contentType: contentType
				}))
			} else {
				this.element.find('.content-slots-categories').html(this.view('content_slots_categories', {
					behaviors: behaviors[0],
					type: this.type,
					loadFirstTab : this.proxy('loadFirstContentTab'),
					cleanRouteUrl: cleanRouteUrl
				}));
			}
		},
		loadFirstContentTab : function(ul){
			var hash = ul.find('a:first').attr('href');
			if(window.location.hash !== hash){
				window.location.hash = hash;
			} else {
				this.loadContentTab();
			}
		},
		"{can.route} settings change" : "loadContentTab",
		"{can.route} behavior change" : "loadContentTab",
		loadContentTab : function(){
			clearTimeout(this._loadTimeout);
			this._loadTimeout = setTimeout(this.proxy(function(){
				this.element.find('.tab-content').empty();
				this.element.find('ul.content-tabs li.active').removeClass('active');
				this.element.find('ul.content-tabs li.'+can.route.attr('settings')+'-tab').addClass('active');
				if(can.route.attr('settings') === "behaviors"){
					var behavior = can.route.attr('behavior');
					var attrName = behavior + "_content";
					var contentTypeName = ["TemplateContentType", this.templateGroup.classify(), this.type.classify(), behavior.classify()].join('0');
					var contentType = Admin.Models.ContentTypes[contentTypeName];
					var contentTypeDefinition = contentType.contentTypeDefinition();
					var behaviorContent = this.options.page.attr(attrName) || {};
					if($.isFunction(behaviorContent.attr)){
						behaviorContent = behaviorContent.attr();
					}
					if(contentTypeDefinition.fields && contentTypeDefinition.fields.length > 0){
						this.options.page.attr(attrName, new contentType(behaviorContent));
					}
					this.element.find('.tab-content').html(this.view('behavior', {
						model: this.options.page.attr(attrName),
						contentTypeDefinition : contentTypeDefinition
					}))
				}
			}), 0)
			
		},
		"li.dropdown hoverinit" : function(el){
			clearTimeout(this._dropdownTimeout)
			el.find('.dropdown-menu').fadeIn(100);
		},
		"li.dropdown hoverleave" : function(el){
			this._dropdownTimeout = setTimeout(function(){
				el.find('.dropdown-menu').fadeOut(100);
			}, 100)
		},
		".dropdown-menu a click" : function(el){
			el.closest('ul').hide();
		}
	})

	/*
		init : function(){
			window.page = this.options.page
			if(typeof this.options.page.attr('behaviors') === "undefined"){
				this.options.page.attr('behaviors', {});
			}
			$.when(Admin.Models.Page.findAll({}), Admin.Models.Template.findAll({})).then(this.proxy("render"))
		},
		render : function(pages, templates){
			this.templates = templates[0];
			this.pages     = pages[0];


			this.template = Admin.Models.Template.all().getByPath(this.options.page.template)[0]

			
			this.updatePath(this.options.page.slug);
			this.showBehaviors();
			if(!this.options.page.isNew()){
				this.element.find('.behavior-toggle:checked').each(this.proxy(function(i, el){
					this.loadBehaviorFiles($(el));
				}))
			}
			//this.element.find('select').chosen()
		},
		"form saved" : function(el, ev){
			can.route.attr({type: "pages", action: "list"})
		},
		'.behavior-toggle change' : function(el, ev){
			var behavior, behaviorName;
			if(el.is(':checked')){
				this.loadBehaviorFiles(el);
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
			this.options.page.attr("section_content_type", val)
			this.options.page.attr("behaviors", {})
			this.showBehaviors();
		},
		"#page_template change" : function(el, ev){
			var val = el.val();
			this.options.page.attr("behaviors", {})
			if(typeof val === "undefined" || val === ""){
				delete this.template;
				this.options.page.attr("template", "");
				this.element.find(".behaviors-wrapper").html();
			} else {
				this.template = Admin.Models.Template.all().getByPath(val)[0];
				this.options.page.attr("template", val)
				this.showBehaviors()
			}
		},
		".enable-page-content change" : function(el, ev){
			var checked = el.is(":checked");
			this.element.find('.page-content-type-wrap').toggle(checked);
			if(!checked){
				this.element.find("#page_content_node_type").val("").trigger("change");
			}
		},
		".enable-acts-as-section change" : function(el, ev){
			var checked = el.is(":checked");
			this.element.find('.content-section-wrap').toggle(checked);
			if(!checked){
				this.element.find("#page_section_content_type").val("").trigger("change");
			}
		},
		loadBehaviorFiles : function(el){
			behaviorName = el.data('behavior');
			behavior = this.template.getBehaviorsFor(this.element.find("#page_section_content_type").val()).get(behaviorName);
			if(typeof this.options.page.attr("behaviors." + behaviorName) === "undefined"){
				this.options.page.attr("behaviors." + behaviorName, {});
			}
			window.page = this.options.page
			el.closest('.behavior').find('.templates').html(this.view('templates.ejs', {
				behavior: behavior,
				path: this.calculatePath(this.element.find('#page_slug').val()),
				slots: Admin.Models.TemplateSlot.findAll({ids: getTemplatesAsArray(behavior.templates)}),
				page: this.options.page,
				availableSlots: Admin.Models.Slot.findAll({}),
				defaultSlots  : Admin.Models.TemplateSlot.defaultSlots()
			})).show()
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
			if(typeof slug === "undefined" || slug === ""){
				slug = "<page-slug>"
			}
			var path = calculatePath(this.pages, this.element.find('#page_parent_id').val(), slug);
			if(path !== ""){
				path = "/" + path;
			}
			return path;
		},
		updatePath : function(slug){
			var path = this.calculatePath(slug);
			this.element.find('.calculated-path span').text(path);
			this.element.find('.behavior-path .path').text(path);
		},

		" hidden" : function(){
			this.element.remove();
		}
	*/
})