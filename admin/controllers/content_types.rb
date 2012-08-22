Admin.controllers :content_types, :provides => :json do
  
  get :index do
    @content_types = Kekomi::ContentTypes::Store.instance.content_types_metadata
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
