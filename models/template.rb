require 'base64'

class Template

  attr_reader :id

  def self.from_folder(folder)
    path = File.join(PADRINO_ROOT, "theme", "templates", folder)
    if File.exist? path
      Template.new(path)
    end
  end


  def self.all
    templates = Dir.glob(File.join(PADRINO_ROOT, "theme", "templates", "*"))
    templates.select { |t| File.directory?(t) and t != "." and t != ".." and !File.basename(t).start_with?("_") }.map do |t|
      Template.new(t)
    end
  end

  def initialize(folder, default = nil)
    @_folder  = folder
    @id      = Base64.encode64(folder)
    unless self.is_default?
      @default = default || self.class.from_folder("default")
    end
  end

  def templates
    if self.is_default?
      @templates ||= list_templates
    else
      @templates ||= merge_templates list_templates, (@default.nil?? [] : @default.templates)
    end
    @templates
  end

  def local_templates
    templates.map do |t|
      t.gsub(File.join(PADRINO_ROOT, "theme", "templates"), "")[1..-1]
    end
  end

  def behaviors
    # This method lists available behaviors for the template group
    behavior_list = [
      {
        :id => :section,
        :templates => {},
        :url => ""
      },
      {
        :id => :list,
        :templates => {},
        :url => "/list"
      },
      {
        :id => :details,
        :templates => {},
        :url => "/<item-slug>"
      },
      {
        :id => :archive_year,
        :templates => {},
        :url => "/archive/<year>"
      },
      {
        :id => :archive_month,
        :templates => {},
        :url => "/archive/<year>/<month>"
      },
      {
        :id => :archive_day,
        :templates => {},
        :url => "/archive/<year>/<month>/<day>"
      }
    ]
    allowed_ext = %w(html json js rss xml)
    # Go through all templates
    local_templates.each do |t|
      # Convert from "/folder/file.html" to "file"
      basename = File.basename(t).split('.')
      behavior = basename.first
      ext      = basename.last.downcase
      if allowed_ext.include? ext
        # Go through all predefined behaviors
        behavior_list.each do |b|
          content_type = nil
          # If behavior's id is same as filename then 
          # add this file as a default template for this
          # behavior. For instance if behavior is named
          # "details" and filename after conversion is
          # also named "details" this file will be
          # default template for "details" behavior
          if behavior == b[:id].to_s
            content_type = "*"
          # if file after conversion to behavior is named
          # "details_news" this will be used to render this
          # behavior for the News content type
          elsif behavior.start_with? b[:id].to_s
            content_type = behavior["#{b[:id]}_".length..-1]
          end
          unless content_type.nil?
            b[:templates][content_type] ||= {}
            b[:templates][content_type][ext] = t
            break
          end
        end
      end
    end
    behavior_list.select { |b| !b[:templates].empty? }
  end

  def merge_templates(templates, default = [])
    base_named = templates.map { |t| File.basename t }
    default.each do |t|
      templates << t unless base_named.include? File.basename t
    end
    templates
  end

  def list_templates
    templates = Dir.entries(@_folder).reject do |file|
      File.directory?(file) or File.basename(file) === "options.yml"
    end
    templates.map do |t|
      File.join @_folder, t
    end
  end

  def is_default?
    @is_default ||= @_folder.split(File::SEPARATOR).last == "default"
  end

  def path
    @_folder.gsub(File.join(PADRINO_ROOT, "theme", "templates"), "")[1..-1]
  end

end
