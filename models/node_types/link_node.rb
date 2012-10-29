module NodeTypes
  class LinkNode < Node

    register_node_type

    def url
      self.link_url
    end

  end
end