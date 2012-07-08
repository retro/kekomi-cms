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

  before_save :cleanup_belongs

  def self.publish_state(state)
    if state == "published"
      where(is_published: true)
    elsif state == "draft"
      where(is_published: false)
    else
      where
    end
  end

  def self.in_section(section_id)
    section_id.blank?? where : where(section_id: section_id)
  end

  def representation
    self.send self.class.represented_with
  end

  def move=(args)
    action, id = args.to_a.flatten
    move({action.to_sym => self.class.find(id)})
  end

  def must_be_attached_or_have_section
    errors.add(:section_id, "can't be empty") if section.blank? and page.blank?
  end

  def cleanup_belongs
    self.page_id = nil unless self.section_id.nil?
  end

end
