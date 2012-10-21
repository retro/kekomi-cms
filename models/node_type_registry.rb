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
    types.map do |name, klass|
      {
        id: name,
        name: klass.to_s.demodulize[0..-5].humanize
      }
    end
  end

end