class ContentNode
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  belongs_to :page

  scope :not_attached, where(page_id: nil)

end
