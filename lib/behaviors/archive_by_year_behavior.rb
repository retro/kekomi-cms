class ArchiveByYearBehavior
  include Behavior

  def render(args)
    path, year = context.params[:captures]
    slug = extract_slug(path)
    self.class.to_s
  end
end