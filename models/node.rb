class Node

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
  
  field :template_group
  field :position, :type => Integer

  def self.register_behaviors(type_behaviors)

    @type_behaviors = type_behaviors

    behaviors = Behavior::Registry.behaviors.map { |behavior| 
      type_behaviors.include?(behavior.id) ? behavior.id : nil
    }.compact

    # This code will define accessor methods for content for all possible behaviors
    # We reuse Kekomi::ContentTypes here to get all the goodnes like getters and setters,
    # but code will be converted to simple hash before document is saved

    behaviors.each do |behavior|

      define_method "#{behavior}_content=" do |content|

        return unless self.behaviors_with_content.include?(behavior)

        @_serialize_content ||= []
        @_serialize_content << behavior unless @_serialize_content.include? behavior

        if content.class.to_s != name_for_content_klass(behavior)
          content = content_klass_for_behavior(behavior).new(content)
        end
        
        write_attribute "#{behavior}_content", content

      end

      define_method "#{behavior}_content" do 

        return unless self.behaviors_with_content.include?(behavior)

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
  end

  def self.type_behaviors
    @type_behaviors
  end

  def self.register_node_type(name = nil)
    NodeTypeRegistry.register self, name
  end

  before_save :serialize_behavior_content

  before_create :set_position

  def behaviors
    return [] if template_group.nil?
    templates.behaviors.map do |behavior|
      behavior[:id].to_s
    end
  end

  # This code will serialize content of all behaviors that
  # were changed. It will convert it from the class to the 
  # simple hash that can be easily saved in the MongoDB
  def serialize_behavior_content
    unless @_serialize_content.blank?
      @_serialize_content.each do |behavior|
        attribute = "#{behavior}_content".to_sym
        content = self.send(attribute)
        unless content.nil?
          attribute_will_change! attribute
          content.serialize_fields
          attrs = content.attributes
          attrs.delete "_id"
          attributes.delete(attribute.to_s)
          attributes[attribute] = attrs
        end
      end
    end
  end

  def serialized_behavior_content(behavior)
    content = self.send("#{behavior}_content")
    return content if content.nil?
    data = {}
    content.class.serializable_fields.each_pair do |key, value|
      if value.to_s.split("::")[-2] == "Compound"
        compound = []
        values = content.send(key)
        values.each do |value|
          compound << { value: value, type: value.class.to_s.demodulize.underscore }
        end
        data[key] = compound
      else
        field_data = content.send(key)
        field_data = field_data.respond_to?(:serialize) ? field_data.serialize : field_data
        data[key]  = field_data
      end
    end

    data
  end

  def set_position
    self.position = self.siblings.size
  end

  def node_type
    self.class.to_s.demodulize.underscore[0..-6]
  end

  def templates
    TemplateGroup.from_folder(template_group, node_type)
  end

  def template_fields

    fields = {}

    templates.behaviors.to_a.each do |b|
      fields[b[:id]] = {}
      files          = b[:templates]
      TemplateGroup::ALLOWED_EXTENSIONS.each do |ext|
        unless files[ext].nil?
          fields[b[:id]].reverse_merge! TemplateContentField.new(File.join(template_group, files[ext])).fields
        end
      end
      fields.delete(b[:id]) if fields[b[:id]].blank?
    end
    
    fields.blank?? nil : fields
  end

  def template_slots
    TemplateSlot.from_folder(self.template_group, node_type)
  end

  def combined_slots

    slots_paired_with_id = {}

    template_slots.each do |slot|
      unless slots[slot].blank?
        slots_paired_with_id[slot] = BSON::ObjectId(slots[slot].to_s)
      else
        slots_paired_with_id[slot] = nil
      end
    end

    if slots_paired_with_id.has_value? nil
      default_slots = DefaultSlot.paired
      slots_paired_with_id.each do |name, id|

        if id.nil?
          default_slot = default_slots.select { |slot|
            slot[:template_slot] == name
          }.first
          slots_paired_with_id[name] = default_slot[:slot_id] unless default_slot.nil?
        end

      end
    end

    loaded = Slot.find(slots_paired_with_id.values.compact)

    slots_paired_with_id.each do |name, id|
      slot = loaded.select {|s|
        s.id == id
      }.first
      slots_paired_with_id[name] = slot unless slot.nil?
    end

    slots_paired_with_id
  end

  def behaviors_with_content
    template_fields ? template_fields.keys.map(&:to_s) : []
  end

  def content_klass_for_behavior(behavior)
    return nil unless behaviors_with_content.include? behavior
    TemplateContentField.content_type_for(template_group, node_type, behavior)
  end

  def has_editable_fields?
    templates.behaviors.to_a.each do |b|
      files = b[:templates]
      TemplateGroup::ALLOWED_EXTENSIONS.each do |ext|
        unless files[ext].nil?
          return true unless TemplateContentField.new(File.join(template_group, files[ext])).fields.blank?
        end
      end
    end
    return false
  end

  def content
    pages = []
    behaviors_with_content.each do |behavior|
      content = self.send "#{behavior}_content"
      unless content.nil?
        content.page_content_id = name_for_content_klass(behavior).underscore
        pages << content
      end
    end
    pages
  end

  def url
    ""
  end

  private

    def name_for_content_klass(behavior)
      type = self.class.to_s.demodulize[0...-4]
      return TemplateContentField.content_type_name(template_group, type, behavior)
    end


end