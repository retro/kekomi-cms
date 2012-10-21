Admin.controllers :content_types, :provides => :json do
  
  get :index do
    @content_types = Kekomi::ContentTypes::Store.instance.content_types_metadata.select do |metadata|
      metadata[:name].match(/TemplateContentType(.*)/).nil?
    end
    render "content_types/index"
  end

  get "/:folder/:type/:behavior" do
    template = TemplateContentField.content_type_for(params[:folder], params[:type], params[:behavior]).to_s
    @content_type = Kekomi::ContentTypes::Store.instance.content_types_metadata.select { |metadata|
      metadata[:name] == template
    }.first
    render "content_types/details"
  end
  
  get "/:folder/:type" do
    behaviors = TemplateGroup.from_folder(params[:folder], params[:type]).behaviors
    @content_types = []
    behaviors.each do |behavior|
      template = TemplateContentField.content_type_for(params[:folder], params[:type], behavior[:id].to_s).to_s
      @content_types << Kekomi::ContentTypes::Store.instance.content_types_metadata.select { |metadata|
        metadata[:name] == template
      }.first
    end
    render "content_types/template_group"
  end

end
