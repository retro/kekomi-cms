class TemplateGroup

  attr_reader :id
  attr_accessor :type

  ALLOWED_EXTENSIONS = %w(html json js rss xml)

  def self.from_folder(folder, type = :page)
    path = File.join(PADRINO_ROOT, "theme", "templates", folder)
    if File.exist? path
      self.new(path, type)
    end
  end

  def self.all(type = :page) 
    Dir.glob(File.join(PADRINO_ROOT, "theme", "templates", '*')).select { |f|
      File.directory? f
      }.map { |folder| 
        self.new(folder, type)
      }
  end

  def initialize(folder, type = :page)
    @folder = folder
    @type   = type.to_sym
    @id     = File.basename folder
  end

  def node_type
    NodeTypeRegistry.types[@type]
  end

  def has_behavior?(behavior)
    node_type.type_behaviors.include? behavior.to_s
  end

  def behaviors
    return [] if node_type.type_behaviors.nil?

    Behavior::Registry.behaviors.map { |behavior|
      # List all registered behaviors and create hash from each
      { id:  behavior.id.to_sym, url: behavior.pattern, templates: {} }
    }.select { |behavior|
      # Check if behavior is available for type
      has_behavior? behavior[:id]
    }.map { |behavior|
      # go through all allowed extensions
      ALLOWED_EXTENSIONS.each do |ext|
        # check if there is typed template
        # for instance if type was article, this would check if list_article or detail_article
        # template exist
        template = "#{behavior[:id]}_#{@type}.#{ext}"
        behavior[:templates][ext] = template if templates.include? template
        # if template is not already set to the typed template then check if there
        # is a defualt template available
        if behavior[:templates][ext].blank?
          template = "#{behavior[:id]}.#{ext}"
          behavior[:templates][ext] = template if templates.include? template
        end
      end
      behavior
    }.reject { |behavior| behavior[:templates].blank? } # filter out behaviors without assigned templates
  end

  def content_type_for_behavior(behavior)
    TemplateContentField.content_type_name(base_folder, @type, behavior)
  end

  def base_folder
    @folder.split(File.join(PADRINO_ROOT, "theme", "templates")).last[1..-1]
  end

  def templates
    @templates ||= Dir.entries(@folder).reject do |file|
      File.directory?(file) or File.basename(file) === "options.yml"
    end
  end

end
