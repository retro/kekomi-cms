module NodeTypes
  class SectionNode < Node

    def self.inherited(subclass)
      subclass.register_behaviors %w(page list detail archive_by_year archive_by_month archive_by_day)
    end

  end
end