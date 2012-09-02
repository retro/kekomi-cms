Admin.controllers :templates, :provides => :json do

  get :index do
    @templates = Template.all
    render "templates/index"
  end
  
end
