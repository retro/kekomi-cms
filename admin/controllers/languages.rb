Admin.controllers :languages, :provides => :json do

  get :index do
    langs = Languages.all
    {
      data: langs,
      count: langs.count
    }.to_json
  end

end
