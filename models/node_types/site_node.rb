module NodeTypes
  class SiteNode < Node

    register_node_type
    register_behaviors %w(page missing_page)
    
    field :language
    field :domain
    field :slots, :type => Hash

  end
end