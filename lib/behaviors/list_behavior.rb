class ListBehavior
  include Behavior

  pattern "/list"

  def render(args)
    slug = extract_slug(context.params[:captures].first)
    self.class.to_s
  end
end