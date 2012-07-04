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