Admin.controllers :pages, :provides => :json do
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

  get "/" do
    @pages = Node.asc(:position)
    render "pages/index"
  end

  post "/" do
    klass = NodeTypeRegistry.types[json_body["node_type"].to_sym]
    @page = klass.new
    @page.template_group = json_body.delete "template_group"
    @page.attributes     = json_body
    @page.save
    render "pages/create"
  end

  get "/:id" do
    @page = Node.find params[:id]
    render "pages/create"
  end
  
  put "/:id" do
    @page = Node.find params[:id]
    if @page
      puts json_body
      @page.update_attributes json_body
      render "pages/create"
    else
      halt 404
    end
  end

  delete "/:id" do
    @page = Node.find params[:id]
    @page.destroy
    render "pages/create"
  end

end
