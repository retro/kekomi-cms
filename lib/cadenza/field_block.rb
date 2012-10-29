Cadenza::BaseContext.define_block :field do |context, nodes, parameters|

  node      = context.lookup("node")
  behavior  = context.lookup("behavior")

  attribute = parameters.first.identifier.to_sym

  if node.has_editable_fields? 
    content = node.send("#{behavior}_content")
    unless content.nil? and content.respond_to? attribute
      nodes.inject("") do |output, child|
        context.push({field_value: content.send(attribute)})
        node_text = Cadenza::TextRenderer.render(child, context)
        output << node_text
      end
    end
  end

end