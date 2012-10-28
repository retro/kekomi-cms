class Languages
  def self.all
    langs     = LanguageList::COMMON_LANGUAGES
    order     = %w(en de hr es pt)
    formatted = []
    order.each do |l|
      formatted << format_lang(LanguageList::LanguageInfo.find(l))
    end
    langs.each do |lang|
      unless order.include? lang.iso_639_1
        formatted << format_lang(lang)
      end
    end
    formatted
  end
  def self.format_lang(lang)
    {
      id: lang.iso_639_1,
      name: lang.name
    }
  end
end