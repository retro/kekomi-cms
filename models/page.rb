class Page
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Tree

  # field <name>, :type => <type>, :default => <value>
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :slug
  field :title

  field :slots

  field :template

  field :position, :type => Integer

  field :template

  field :content_node_type

  has_one :content_node

  before_create :set_position

  def set_position
    self.position = self.siblings.size
  end

  def content_node_with_set_class=(content)
    unless content.class < ContentNode
      content = self.content_node_type.classify.constantize.new(content)
    end
    self.content_node_without_set_class = content
  end

  alias_method_chain :content_node=, :set_class


end
