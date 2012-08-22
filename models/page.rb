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
  field :section_content_type
  field :behaviors


  # This code will define accessor methods for content for all possible behaviors
  # We reuse Kekomi::ContentTypes here to get all the goodnes like getters and setters,
  # but code will be converted to simple hash before document is saved

  %w(section list details archive_year archive_month archive_day).each do |behavior|

    define_method "#{behavior}_content=" do |content|

      @_serialize_content ||= []
      @_serialize_content << behavior unless @_serialize_content.include? behavior

      if content.class.to_s != name_for_content_klass(behavior)
        content = content_klass_for_behavior(behavior).new(content)
      end
      
      write_attribute "#{behavior}_content", content

    end

    define_method "#{behavior}_content" do 

      @_serialize_content ||= []
      @_serialize_content << behavior unless @_serialize_content.include? behavior

      content = read_attribute "#{behavior}_content"

      return nil if content.nil?

      if content.class.to_s != name_for_content_klass(behavior)
        content = content_klass_for_behavior(behavior).new(content)
      end

      write_attribute "#{behavior}_content", content

      content

    end

  end


  has_many :items, :class_name => 'ContentNode'

  before_save :serialize_behavior_content

  before_create :set_position

  # This code will serialize content of all behaviors that
  # were changed. It will convert it from the class to the 
  # simple hash that can be easily saved in the MongoDB
  def serialize_behavior_content
    unless @_serialize_content.blank?
      @_serialize_content.each do |behavior|
        attribute = "#{behavior}_content".to_sym
        content = self.send(attribute)
        attribute_will_change! attribute
        content.serialize_fields
        attrs = content.attributes
        attrs.delete "_id"
        attributes[attribute] = attrs
      end
    end
  end

  def set_position
    self.position = self.siblings.size
  end

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

  def template_fields

    templates_behavior = self.templates
    exts               = %w(html json js rss xml)
    fields    = {}
    templates_behavior.each_pair do |key, val|
      fields[key] = {}
      exts.each do |ext|
        unless val[ext].nil?
          fields[key].reverse_merge! TemplateContentField.new(val[ext]).fields
        end
      end
    end
    fields.blank?? nil : fields

  end

  def content_klass_for_behavior(behavior)
    behavior = behavior.underscore
    klass_definition = template_fields[behavior]
    klass_name = name_for_content_klass(behavior)
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

  private

    def name_for_content_klass(behavior)
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