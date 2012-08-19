class Slot
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :rules, :type => Array

end
