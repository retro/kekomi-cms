Admin.controllers :template_slots, :provides => :json do

  get "/default" do
    {
      id:    "default",
      slots: DefaultSlot.paired
    }.to_json
  end

  put "/default" do
    slots = DefaultSlot.assign(json_body["slots"])
    {
      id:    "default",
      slots: slots
    }.to_json
  end

  get :index do
    halt 404 if params[:ids].blank?
    @template_slots = TemplateSlot.all(params[:ids])
    render "template_slots/index"
  end

  

end
