module NodeTypes
  class SiteNode < Node

    register_node_type
    register_behaviors %w(page missing_page)
    

  end
end