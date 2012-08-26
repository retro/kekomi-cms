Admin.controllers :content_types, :provides => :json do
  
  get :index do
    assigned_content_types = Page.all.distinct(:section_content_type)
    @content_types = Kekomi::ContentTypes::Store.instance.content_types_metadata.select do |metadata|
      metadata[:assigned] = assigned_content_types.include? metadata[:name].underscore
      metadata[:name].match(/PageContent\w+Behavior\w+/).nil?
    end
    render "content_types/index"
  end

  get "/:id" do
    page           = Page.find(params[:id])
    klasses        = page.content_klasses_for_behaviors.map(&:to_s)
    @content_types = Kekomi::ContentTypes::Store.instance.content_types_metadata.select do |metadata|
      klasses.include? metadata[:name]
    end
    render "content_types/index"
  end
  
end
