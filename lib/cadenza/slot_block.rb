Cadenza::BaseContext.define_block :slot do |context, nodes, parameters|

  slots = context.lookup("slots")

  unless slots.nil? 
    slot_name, count = parameters

    slot_name = slot_name.identifier

    nodes.inject("") do |output, child|
      if slots[slot_name]
        placeholder = "Here results for slot named #{slot_name} would be rendered"
      else
        placeholder = "Slot named #{slot_name} is not defined either as default or for this node"
      end
      context.push({slot_items: placeholder})
      node_text = Cadenza::TextRenderer.render(child, context)
      output << node_text
    end
  end

end