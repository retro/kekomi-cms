class ContentNode
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  include Mongoid::TaggableWithContext
  include Mongoid::TaggableWithContext::AggregationStrategy::RealTime

  belongs_to :section, :class_name => 'Page'

  belongs_to :page

  scope :not_attached, where(page_id: nil)

  taggable :tags, :separator => ','

end
