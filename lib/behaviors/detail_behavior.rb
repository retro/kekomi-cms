class DetailBehavior
  include Behavior

  pattern "/<item-slug>"

  def render(args)
    self.class.to_s
  end
end