class ArchiveByDayBehavior
  include Behavior

  pattern "/archive/<year>/<month>/<day>"

  def render(args)
    path, year, month, day = context.params[:captures]
    slug = extract_slug(path)
    self.class.to_s
  end
  
end