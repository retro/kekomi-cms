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

end