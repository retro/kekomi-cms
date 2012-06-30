class ContentNode
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  has_one :page

end
