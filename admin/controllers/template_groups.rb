Admin.controllers :template_groups, :provides => :json do

  get :index do
    @template_groups = TemplateGroup.all
    render "template_groups/index"
  end
  
  get "/:id/:type" do
    @template_group = TemplateGroup.from_folder(params[:id], params[:type])
    render "template_groups/details"
  end

end
