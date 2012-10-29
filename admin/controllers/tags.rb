Admin.controllers :tags, :provides => :json do
  # get :index, :map => "/foo/bar" do
  #   session[:foo] = "bar"
  #   render 'index'
  # end

  # get :sample, :map => "/sample/url", :provides => [:any, :js] do
  #   case content_type
  #     when :js then ...
  #     else ...
  # end

  # get :foo, :with => :id do
  #   "Maps to url '/foo/#{params[:id]}'"
  # end

  # get "/example" do
  #   "Hello world!"
  # end

  get :index do
    tags = ContentItem.tags.sort
    if params[:q]
      q = params[:q].to_s.downcase
      tags.select! { |tag|
        tag.downcase.starts_with? q
      }
    end

    {
      data: tags.map { |tag| {id: tag }},
      count: tags.count
    }.to_json
  end
  
end
