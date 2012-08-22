class Page
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Tree

  # field <name>, :type => <type>, :default => <value>
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :slug
  field :title
  field :slots
  field :template
  field :position, :type => Integer
  field :template
  field :content_node_type
  field :section_content_type
  field :behaviors

  has_one :content_node
  has_many :items, :class_name => 'ContentNode'

  before_create :set_position

  def set_position
    self.position = self.siblings.size
  end

  def content_node_with_set_class=(content)
    unless content.class < ContentNode
      content = self.content_node_type.classify.constantize.new(content)
    end
    self.content_node_without_set_class = content
  end

  alias_method_chain :content_node=, :set_class

  def templates

    templates_for_page = {}
    content_type       = self.section_content_type.blank?? '*' : self.section_content_type
    section_behaviors  = Template.from_folder(self.template).behaviors

    self.behaviors.each_pair do |key, val|
      templates_from_folder   = section_behaviors.select{ |t| t[:id] == key.to_sym }.first[:templates]
      content_type_templates  = templates_from_folder[content_type] || {}
      default_type_templates  = templates_from_folder['*'] || {}
      templates_for_page[key] = content_type_templates.merge default_type_templates
    end

    templates_for_page

  end

  def fields

    templates_behavior = self.templates
    exts               = %w(html json js rss xml)
    template_fields    = {}
    templates_behavior.each_pair do |key, val|
      template_fields[key] = {}
      exts.each do |ext|
        unless val[ext].nil?
          template_fields[key].reverse_merge! TemplateContentField.new(val[ext]).fields
        end
      end
    end
    template_fields.blank?? nil : template_fields

  end

  def content_klass_for_behavior(behavior)
    behavior = behavior.underscore
    klass_definition = fields[behavior]
    klass_name = generate_name_for_content_klass(behavior)
    if Object.const_defined? klass_name
      if Padrino.env == :development
        Object.send :remove_const, klass_name.to_sym
      else
        return klass_name.to_s.constantize
      end
    end
    Kekomi::ContentTypes.add_without_base klass_name do
      klass_definition.each_pair do |field_name, type|
        field field_name, type: type
      end
    end
  end

  #private

    def generate_name_for_content_klass(behavior)
      return "PageContent#{behavior.to_s.classify}Behavior#{id}"
    end

end

class Object

  class << self 
    def const_missing_with_page_content_klass_autoload(const)
      match = const.to_s.scan(/PageContent(\w+)Behavior(\w+)/)
      if match.empty?
        return const_missing_without_page_content_klass_autoload(const)
      else
        behavior, id = match.first
        Page.find(id).content_klass_for_behavior(behavior)
      end
    end

    alias_method_chain :const_missing, :page_content_klass_autoload
  end

end