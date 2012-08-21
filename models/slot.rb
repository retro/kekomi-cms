class Slot
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :sections, :type => Array
  field :rules, :type => Array

end
