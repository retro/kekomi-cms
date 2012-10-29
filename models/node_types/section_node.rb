module NodeTypes
  class SectionNode < Node

    field :slots, type: Hash, default: {}
    field :item_count, default: 0

    def self.inherited(subclass)
      subclass.register_behaviors %w(page list detail archive_by_year archive_by_month archive_by_day)
    end

    def url
      base_url = self.ancestors.map { |node|
        node.slug
      }

      base_url << slug

      "/#{base_url.join('/')}"
    end

  end
end