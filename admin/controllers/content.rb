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
    @resource = params[:model].classify.constantize unless params[:model].nil?
  end

  helpers do

    def resource
      @resource
    end

    def jsonify(item)
      data = {
        id: item.id, 
        created_at: item.created_at,
        representation: item.representation,
        slug: item.slug,
        published_at: item.published_at,
        tags: item.tags,
        is_published: item.is_published,
        section_id: item.section_id
      }
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
    allowed_filters = %w(publish_state page in_section order_by)
    filters = {
      publish_state: "any",
      page: 1
    }.merge((params[:filters] || {}).symbolize_keys)

    if filters[:in_section].nil?
      filters[:order_by] ||= [:published_at, :desc]
    else
      filters[:order_by] ||= [:position, :desc]
    end

    page = filters.delete :page

    @content_items = resource.not_attached

    filters.each_pair do |key, value|
      if allowed_filters.include? key.to_s
        @content_items = @content_items.send key, value
      end
    end

    @count = @content_items.count

    @content_items = @content_items.page(page)

    render "content/index"
  end

  post "/:model" do
    @item = resource.new
    json_body.each_pair do |key, value|
      @item.send :"#{key}=", value
    end
    if @item.save
      jsonify(@item)
    else
      error 406, render("content/errors")
    end
  end

  get "/:model/:id" do
    @item = resource.find(params[:id])
    jsonify(@item)
  end

  put "/:model/:id" do
    @item = resource.find(params[:id])
    json_body.each_pair do |key, value|
      @item.send :"#{key}=", value
    end
    @item.save
    jsonify(@item)
  end

  

  delete "/:model/:id" do
    resource.find(params[:id]).destroy
  end

end
