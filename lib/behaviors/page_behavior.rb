class PageBehavior
  include Behavior

  def render(args)
    if context.params.empty?
      # We are on the frontpage of the default site
      site = NodeTypes::SiteNode.first

      template_group = TemplateGroup.from_folder(site.template_group, :site)
      template = template_group.template_for_behavior(:page)

      if template.nil?
        halt 404
      else

        Cadenza.render_template template, {
          site:     site,
          slots:    site.combined_slots,
          node:     site,
          behavior: 'page'
        }

      end
    else
      #url_parts = context.params[:captures].split("/")
      #nodes     = Node.find
      "a"
    end
  end
end