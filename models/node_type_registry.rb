class NodeTypeRegistry

  def self.register(node_type_klass, name = nil)
    name   ||= node_type_klass.to_s.demodulize.underscore[0..-6]
    @types ||= {}
    @types[name.to_sym] = node_type_klass
    @types
  end

  def self.types
    @types || {}
  end

  def self.all
    order = [:site, :page, :link]
    types.each do |name, klass|
      node_type = {
        id: name,
        name: klass.to_s.demodulize[0..-5].humanize
      }
      index = order.index(name.to_sym)
      if index.nil?
        order << node_type
      else
        order[index] = node_type
      end
    end
    order
  end

end