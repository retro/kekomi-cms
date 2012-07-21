require "pp"

Admin.controllers :assets do
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
    @assets = Asset.order_by(:created_at => :desc).all
    render "assets/index"
  end

  post "/" do
    @asset = Asset.new
    @asset.file = params[:file]
    @asset.name = params[:file][:filename]
    @asset.save
    render "assets/item"
  end
  
  delete "/:id" do
    Asset.find(params[:id]).destroy
  end

end
