Frontend.controllers "/" do
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


  helpers do 
    def extract_slug(path)
      path.gsub(/^\//, "").split("/").first
    end
  end


  get %r{(.*)/archive/([\d]{4})/([\d]{2})/([\d]{2})} do
    path, year, month, day = params[:captures]
    slug = extract_slug(path)
  end

  get %r{(.*)/archive/([\d]{4})/([\d]{2})} do
    path, year, month = params[:captures]
    slug = extract_slug(path)
  end

  get %r{(.*)/archive/([\d]{4})} do
    path, year = params[:captures]
    slug = extract_slug(path)
  end

  get %r{.*/archive/.*} do
    halt 404
  end

  get %r{(.*)/list} do
    slug = extract_slug(params[:captures].first)
  end

  get %r{/(.+)} do
    slug = extract_slug(params[:captures].first)
  end

  get :index do
    "Root"
  end
  
end
