Admin.controllers :template_slots, :provides => :json do

  get "/default" do
    {
      id:    "default",
      slots: DefaultSlot.paired(true)
    }.to_json
  end

  put "/default" do
    slots = DefaultSlot.assign(json_body["slots"])
    {
      id:    "default",
      slots: slots
    }.to_json
  end

  get "/:folder/:type" do
    slots = TemplateSlot.from_folder(params[:folder], params[:type])
    {
      id:    [params[:folder], params[:type]].join("_"),
      slots: slots
    }.to_json
  end
  

end
