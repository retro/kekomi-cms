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

<<<<<<< HEAD
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

=======
  post "/" do
    params[:files].each do |file|
      asset = Asset.new
      asset.file = file
      asset.filename = file[:filename]
      asset.save
    end
    ""
  end
  
>>>>>>> 701834f098994796692ec4b9c7b90e3ec2d74e7c
end
