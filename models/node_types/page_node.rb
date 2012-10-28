module NodeTypes
  class PageNode < Node

    field :slots, :type => Hash

    register_behaviors %w(page)
    register_node_type

  end
end