class PageBehavior
  include Behavior

  def render(args)
    self.class.to_s
  end
end