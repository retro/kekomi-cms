require 'base64'

class Template

  attr_reader :id

  def self.from_folder(folder, type = :page)
    path = File.join(PADRINO_ROOT, "theme", "templates", folder)
    if File.exist? path
      Template.new(path, type)
    end
  end

  def initialize(folder, type = :page)
    @id   = folder
    @type = type.to_sym
  end


  def has_behavior?(behavior)
    behaviors_per_type = {
      page: %w(page),
      smart_section: %w(page list archive_by_year archive_by_month archive_by_day)
    }
    return true if behaviors_per_type[@type].nil?
    return behaviors_per_type[@type].include? behavior.to_s
  end

  def behaviors
    allowed_ext = %w(html json js rss xml)

    @behaviors ||= Behavior::Registry.behaviors.map { |behavior|
      # List all registered behaviors and create hash from each
      { id:  behavior.id.to_sym, url: behavior.pattern, templates: {} }
    }.select { |behavior|
      # Check if behavior is available for type
      has_behavior? behavior[:id]
    }.map { |behavior|
      # go through all allowed extensions
      allowed_ext.each do |ext|
        # if behavior is not page or smart section, check if there is typed template
        # for instance if type was article, this would check if list_article or detail_article
        # template exist
        unless [:page, :smart_section].include? @type
          template = "#{behavior[:id]}_#{@type}.#{ext}"
          behavior[:templates][ext] = template if templates.include? template
        end
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

  def templates
    @templates ||= Dir.entries(@id).reject do |file|
      File.directory?(file) or File.basename(file) === "options.yml"
    end
  end

end
