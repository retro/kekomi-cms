steal(
'admin/mvc.js',
'steal/less',
'admin/vendor/moment',
'canui/table_scroll'
).then('./list.less', function(){
	var State = can.Observe({

	}, {
		isSortable: function(){
			return ((typeof this.attr('in_section') !== "undefined") && this.attr('in_section') != "")
		},
		serialize : function(){
			var data = this._super.apply(this, arguments);
			delete data.count;
			return data;
		},
		setCount : function(count){
			this.attr('pages', Math.ceil(count / 50));
		},
		setPage : function(raw){
			return parseInt(raw)
		}
	})
	can.Control('Admin.Content.List', {
		defaults: {
			selected: new can.Observe.List
		}
	}, {
		init : function(){
			this.element.html(this.view('init', {
				contentType: this.options.contentTypeModel
			}))
			this.options.state = new State($.extend({ publish_state: "any", page: 1 }, (can.route.attr('state') ? can.route.attr('state').serialize() : {})));
			this.on();
			$.when(this.options.contentTypeModel.findAll({filters: this.options.state.serialize()}), Admin.Models.Page.findAll({})).then(this.proxy('renderInitial'))
		},
		renderInitial : function(items, pages){
			this.pages = pages[0]
			this.renderTable(items[0])
			this.renderFilters();
			this.element.find('.paginate').html(this.view('pagination', {
				state: this.options.state
			}))
		},
		renderFilters : function(){
			this.element.find('.filters').html(this.view('filters', {
				sectionTree: renderTree(this.pages),
				selected: this.options.selected
			}))
			this.element.find('.filters form').formParams({state: can.route.attr('state')})
		},
		renderTable : function(items){
			this.options.state.attr('count', items.count);

			this.element.find('.table-wrap').html(this.view('list', { 
				items       :items,
				contentType : this.options.contentTypeModel,
				breadcrumbs : calculateBreadcrumbs(this.pages),
				state       : this.options.state
			}))
			new can.ui.TableScroll(this.element.find('table'))
			if(this.options.state.isSortable()){
				this.element.find('tbody').sortable({
					handle : ".sort-cell",
					helper : function(e, tr){
						var $originals = tr.children();
						var $helper = tr.clone();
						$helper.children().each(function(index){
							if(index === 0){
								$(this).css('borderLeft', "1px solid #ddd")
							}
							if(index === $originals.length - 1){
								$(this).css('borderRight', "1px solid #ddd")
							}
							$(this).width($originals.eq(index).width()).css('borderBottom', "1px solid #ddd")
						});
						return $helper;
					}
				})
			}
		},
		"td input[type=checkbox] change" : function(el, ev){
			var model = el.closest('.' + can.route.attr('content_type')).model();
			if(el.is(':checked')){
				this.options.selected.push(model)
			} else {
				var index = this.options.selected.indexOf(model)
				if(index > -1){
					this.options.selected.splice(index, 1);
				}
			}
		},
		applyFilters : function(){
			var data = this.element.find('.filters form').formParams().state;
			data.page = 1;
			can.route.attr('state', data, true)
		},
		".filters select change" : "applyFilters",
		".filters input change" : "applyFilters",
		"{can.route} state change" : function(){
			this.element.find('.table-wrap').html("")
			this.options.selected.splice(0, this.options.selected.length);
			var state = this.options.state.serialize(),
				route = can.route.attr('state');
			this.options.state.attr($.extend(state, (route ? route.serialize() : {})));
			this.options.contentTypeModel.findAll({filters: this.options.state.serialize()}, this.proxy('renderTable'))
		},
		"table sortstop" : function(el, ev, ui){
			var tr    = ui.item,
				model = tr.model(),
				trs   = el.find('tr.' +can.route.attr('content_type')),
				index = trs.index(tr);
			if(trs.length === 1) return;
			if(index === trs.length - 1){ // row is placed on the last place
				model.attr('move', {after: $(trs[index - 1]).model().id})
			} else {
				model.attr('move', {before: $(trs[index + 1]).model().id})
			}
			model.save();
		},
		".publish-selected click" : function(el, ev){
			for(var i = 0; i < this.options.selected.length; i++){
				this.options.selected[i].attr('is_published', true).save();
			}
		},
		".delete-selected click" : function(el, ev){
			if(confirm("Are you sure?")){
				for(var i = 0; i < this.options.selected.length; i++){
					this.options.selected[i].destroy();
				}
			}
			
		},
		"{contentTypeModel} destroyed" : function(Klass, ev, model){
			model.elements(this.element).remove();
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

	var calculateBreadcrumbs = function(pages){
		var breadcrumbed = {}, breadcrumbs, parents, path;
		$.each(pages, function(i, page){
			if(page.section_content_type === can.route.attr('content_type')){
				breadcrumbs = can.sub("<a href='{url}'>{name}</a>", {
					url  : can.route.url({state : { in_section: page.id }}, true),
					name : page.name
				});
				parents = pages.parentsOf(page)
				if(parents.length > 0){
					path = parents.map(function(parent){
						return parent.name;
					}).join(' &raquo; ')
					breadcrumbs = path + " &raquo; " + breadcrumbs;
				}
				breadcrumbed[page.id] = breadcrumbs;
			}
		})
		return breadcrumbed;
	}
})