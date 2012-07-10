Admin.controllers :asset_folders, :provides => :json do
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
    @asset_folders = AssetFolder.asc(:parent_id)
    render "asset_folders/index"
  end

  post "/" do
    @asset_folder = AssetFolder.new json_body
    @asset_folder.save
    render "asset_folders/item"
  end

  get "/:id" do
    @asset_folder = AssetFolder.find params[:id]
    render "asset_folders/item"
  end
  
  put "/:id" do
    @asset_folder = AssetFolder.find params[:id]
    if @asset_folder
      @asset_folder.update_attributes json_body
      render "asset_folders/item"
    else
      halt 404
    end
  end

  delete "/:id" do
    @asset_folder = AssetFolder.find params[:id]
    @asset_folder.destroy
    render "asset_folders/item"
  end
end
