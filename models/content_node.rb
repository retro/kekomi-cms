class ContentNode
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::ActsAsList
  include Mongoid::Slug

  include Mongoid::TaggableWithContext
  include Mongoid::TaggableWithContext::AggregationStrategy::RealTime

  field :is_published, type: Boolean, :default => false
  field :published_at, type: DateTime


  belongs_to :section, :class_name => 'Page'

  belongs_to :page

  acts_as_list :scope => :section

  scope :not_attached, where(page_id: nil)

  taggable :tags, :separator => ','

  validate :must_be_attached_or_have_section

  slug :representation, reserve: ['list', 'archive']

  def representation
    self.send self.class.represented_with
  end

  def must_be_attached_or_have_section
    errors.add(:section_id, "can't be empty") if section.blank? and page.blank?
  end

end
