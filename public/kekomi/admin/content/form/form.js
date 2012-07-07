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

	var showErrors = function(errors){
		var self = this;
		$('.error').removeClass('.error').find('.error-wrap').remove()
		$.each(errors, function(key, value){
			var input = self.element.find('[name="content['+key+']"]');
			input.after('<span class="help-inline error-wrap">' + value.join(', ') + '</span>');
			input.closest('.attr-wrap').addClass('error');
		})
	}

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
			console.log(this.options.model.attr('published_at'))
			datetimepicker.datetimepicker('setDate', this.options.model.attr('published_at'));

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
			this.options.model.attr(el.formParams().content)
			this.options.model.attr('published_at', this.element.find('.publish-date-time input').datetimepicker('getDate'))
			this.options.model.save(this.proxy('saved'), this.proxy('errors'))
		},
		saved : function(){
			can.route.attr({action: 'list', type: 'content', content_type: can.route.attr('content_type')})
		},
		errors: function(xhr){
			var errors = $.parseJSON(xhr.responseText);
			showErrors.call(this, errors.errors);
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