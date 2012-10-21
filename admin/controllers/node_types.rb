Admin.controllers :node_types, :provides => :json do

  get "/" do
    @node_types = NodeTypeRegistry.all
    render "node_types/list"
  end

end
