Admin.controllers :slots, :provides => :json do
  
  get "/" do
    @slots = Slot.all
    render "slots/list"
  end

  post "/" do
    @slot = Slot.new json_body
    @slot.save
    render "slots/item"
  end

  get "/:id" do
    @slot = Slot.find params[:id]
    render "slots/item"
  end
  
  put "/:id" do
    @slot = Slot.find params[:id]
    if @slot
      @slot.update_attributes json_body
      render "slots/item"
    else
      halt 404
    end
  end

  delete "/:id" do
    @slot = Slot.find params[:id]
    @slot.destroy
    render "slots/item"
  end
  
end
