class TemplateContentField

  attr_reader :parent, :id

  def self.all(ids)
    unless ids.is_a? Array
      ids = [ids]
    end
    files = ids.map do |id|
      self.new id
    end
  end

  def self.fields_for_behavior(folder, type, behavior)
    content_fields = {}
    behavior       = TemplateGroup.from_folder(folder, type).behaviors.select { |b| b[:id] === behavior.to_sym }
    return nil if behavior.blank?
    behavior.first[:templates].each_pair do |type, template|
      content_fields[type] = self.new File.join(folder, template)
    end
    content_fields.blank?? nil : content_fields
  end

  def self.content_type_for(folder, type, behavior)
    content_fields = self.fields_for_behavior(folder, type, behavior)
    fields         = {}
    return nil if content_fields.nil?
    
    TemplateGroup::ALLOWED_EXTENSIONS.each do |ext|
      unless content_fields[ext].blank?
        fields.reverse_merge! content_fields[ext].fields
      end
    end

    klass_name = self.content_type_name(folder, type, behavior)
    if Object.const_defined? klass_name
      if Padrino.env == :development
        Object.send :remove_const, klass_name.to_sym
      else
        return klass_name.to_s.constantize
      end
    end

    Kekomi::ContentTypes.add_without_base klass_name do


      fields.each_pair do |field_name, type|
        field field_name, type: type
      end

    end
  end

  def self.content_type_name(folder,type,behavior)
    "TemplateContentType0#{folder.to_s.classify}0#{type.to_s.classify}0#{behavior.to_s.classify}"
  end

  def self.fields_for_template_group(folder, type)
    behaviors = TemplateGroup.from_folder(folder, type)
  end

  def initialize(file)
    @file     = file.gsub(':', '/')
    @id       = file
    @contents = File.open(File.join(PADRINO_ROOT, "theme", "templates", file)).read
  end

  def extends?
    return false if @contents.lines.first.nil?
    if @extends.nil?
      match = @contents.lines.first.match /\s*\{%\s*extends\s+["|'](.*?)["|']/
      if match.nil?
        @extends = false
      else
        @extends = true
        @parent = self.class.new(match[1])
      end
    end
    @extends
  end

  def fields
    field_list = extends?? parent.fields : {}
    template_blocks = @contents.scan /\{%\s*block\s+([a-zA-Z0-9_-]*)\s*%\}(.*?)\{%\s*endblock\s*%\}/m
    template_blocks.each do |block|
      field_list.merge! fields_from_string(block.last)
    end
    unless extends?
      contents_without_blocks = @contents.gsub(/\{\%\s*block.*?endblock\s*%\}/m, "")
      field_list.merge! fields_from_string(contents_without_blocks)
    end
    field_list
  end

  private
    def fields_from_string(str)
      block_fields = {}
      str.scan(/\{%\s*field\s+([a-zA-Z0-9_-]*)\s*,\s*([a-zA-Z0-9_-]*)/).map do |s|
        block_fields[s.first.to_sym] = s.last
      end
      block_fields
    end

end

class Object

  class << self 
    def const_missing_with_template_content_type_autoload(const)
      match = const.to_s.scan(/TemplateContentType(.*)/)
      if match.empty?
        return const_missing_without_template_content_type_autoload(const)
      else
        placeholder, folder, type, behavior = const.to_s.split('0')
        TemplateContentField.content_type_for(folder.underscore, type.underscore, behavior.underscore)
      end
    end

    alias_method_chain :const_missing, :template_content_type_autoload
  end

end