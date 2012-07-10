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

  post "/" do
    params[:files].each do |file|
      asset = Asset.new
      asset.file = file
      asset.filename = file[:filename]
      asset.save
    end
    ""
  end
  
end
