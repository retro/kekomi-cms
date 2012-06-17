require 'digest/sha1'

class Template

  attr_reader :id


  def self.all
    templates = Dir.glob(File.join(PADRINO_ROOT, "theme", "pages", "*.html"))
    templates.map do |t|
      Template.new(t)
    end
  end

  def initialize(path)
    @path = path
    @id   = Digest::SHA1.hexdigest path
  end

  def path
    @path.gsub(PADRINO_ROOT, "")
  end

  def slots
    if @slots.nil?
      @slots = {}
      contents = File.open(@path, "rb").read
      contents.scan(/\{%\s*slot\s+["|'](.*)["|']\s*%\}/i).map do |slot|
        @slots[slot.first.underscore.gsub(/\s+/, "_").to_sym] = slot.first
      end
    end
    @slots
  end
end
