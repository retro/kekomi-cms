class DetailBehavior
  include Behavior

  def render(args)
    self.class.to_s
  end
end