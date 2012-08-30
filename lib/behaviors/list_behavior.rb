class ListBehavior
  include Behavior

  def render(args)
    slug = extract_slug(context.params[:captures].first)
    self.class.to_s
  end
end