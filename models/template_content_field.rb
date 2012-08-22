require 'pp'

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