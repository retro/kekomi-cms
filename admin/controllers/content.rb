Admin.controllers :content, :provides => :json do
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

  before do
    @resource = params[:model].classify.constantize
  end

  helpers do

    def resource
      @resource
    end

    def parser
      Yajl::Parser.new
    end

    def jsonify(item)
      data = {id: item.id, created_at: item.created_at}
      item.class.serializable_fields.each_pair do |key, value|
        if value.to_s.split("::")[-2] == "Compound"
          compound = []
          values = item.send(key)
          values.each do |value|
            compound << { value: value, type: value.class.to_s.demodulize.underscore }
          end
          data[key] = compound
        else
          data[key] = item.send(key)
        end
      end
      data.to_json
    end

  end

  get "/:model" do
    @items = resource.page(params[:page] || 1)
    render "content/index"
  end

  post "/:model" do
    body = request.body.read
    @item = resource.new
    data = parser.parse(body)
    data.each_pair do |key, value|
      @item.send :"#{key}=", value
    end
    @item.save
    @item.to_json
  end

  get "/:model/:id" do
    @item = resource.find(:id).first
    jsonify(@item)
  end

  put "/:model/:id" do
    @item = resource.find(:id)
    @item.update_attributes(params[params[:model]])
    @item.to_json
  end

  delete "/:model/:id" do
  end

end
