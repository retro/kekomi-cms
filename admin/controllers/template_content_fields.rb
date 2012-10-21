require "pp"
Admin.controllers :template_content_fields, :provides => :json do
  get "/:group/:type" do
    @template_group = TemplateGroup.from_folder(params[:group], params[:type])
    @behaviors      = @template_group.behaviors

    render "template_content_fields/list"
    
  end
end
