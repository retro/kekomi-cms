module NodeTypes
  class SectionNode < Node

    field :slots, :type => Hash
    field :item_count, default: 0

    def self.inherited(subclass)
      subclass.register_behaviors %w(page list detail archive_by_year archive_by_month archive_by_day)
    end

  end
end