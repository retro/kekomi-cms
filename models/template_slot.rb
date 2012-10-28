require 'base64'

class TemplateSlot

  attr_reader :parent, :id

  def self.all(ids)
    unless ids.is_a? Array
      ids = [ids]
    end
    files = ids.map do |id|
      self.new id
    end
  end

  def self.list
    templates_dir = File.join(PADRINO_ROOT, 'theme', 'templates')
    glob          = File.join(templates_dir, '**/*.{html,json,js,rss,xml}')
    all_slots     = []
    Dir.glob(glob).each do |file|
      slots = TemplateSlot.new(file[(templates_dir.length + 1)..-1]).slots
      all_slots += slots
    end
    all_slots.uniq.sort
  end

  def self.from_folder(folder, type = nil)
    templates_dir = File.join(PADRINO_ROOT, 'theme', 'templates', folder)
    glob          = File.join(templates_dir, "*.{#{TemplateGroup::ALLOWED_EXTENSIONS.join(',')}}")
    all_slots     = []
    files         = Dir.glob(glob)

    unless type.nil?

      behaviors = "NodeTypes::#{type.classify}Node".constantize.type_behaviors
      possible_files = behaviors.map{ |behavior| 
        behavior_files = []
        TemplateGroup::ALLOWED_EXTENSIONS.each do |ext|
          typed_file = File.join(templates_dir, "#{behavior}_#{type}.#{ext}")
          if files.include? typed_file
            behavior_files << typed_file
          else
            behavior_files << File.join(templates_dir, "#{behavior}.#{ext}")
          end
        end
        behavior_files
      }.flatten

      files.select! do |file|
        possible_files.include? file
      end

    end
    
    files.each do |file|
      slots = TemplateSlot.new(file.split('/')[-2..-1].join('/')).slots
      all_slots += slots
    end
    all_slots.uniq.sort
  end

  def initialize(file)
    @file     = file.gsub(':', '/')
    @id       = file
    @contents = File.open(File.join(PADRINO_ROOT, "theme", "templates", file)).read
  end

  def slots
    blocks.map{ |key,val| val }.flatten.compact.uniq.sort
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

  def blocks
    if @blocks.nil?
      @blocks = extends?? parent.blocks : {}
      template_blocks = @contents.scan /\{%\s*block\s+([a-zA-Z0-9_-]*)\s*%\}(.*?)\{%\s*endblock\s*%\}/m
      template_blocks.each do |block|
        name = block.first
        contents = block.last
        
        if !extends? 
          @blocks[name] = slots_from_string(contents)
        elsif @blocks.has_key? name
          calls_super = !(contents.match /\{\{\s*block\.super\s*\}\}/).nil?
          slots = slots_from_string(contents)
          if calls_super
            @blocks[name] += slots
          else
            @blocks[name] = slots
          end
        end
      end
      unless extends?
        contents_without_blocks = @contents.gsub(/\{\%\s*block.*?endblock\s*%\}/m, "")
        @blocks["*"] = slots_from_string(contents_without_blocks)
      end
    end
    @blocks
  end

  private
    def slots_from_string(str)
      str.scan(/\{%\s*slot\s+([a-zA-Z0-9_-]*)\s*/).map {|s| s.first}
    end

end