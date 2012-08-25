require "pp"

class DefaultSlot
  include Mongoid::Document
  
  field :template_slot

  belongs_to :slot

  def self.paired
    template_slots       = TemplateSlot.list
    default_slots        = DefaultSlot.any_in(template_slot: template_slots)
    default_slots_paired = {}
    default_slots.each do |slot|
      default_slots_paired[slot.template_slot] = slot
    end
    template_slots.map do |template_slot|
      {
        template_slot: template_slot,
        slot_id:       (default_slots_paired[template_slot].nil?? nil : default_slots_paired[template_slot].slot_id)
      }
    end
  end

  def self.assign(slots)
    template_slots = slots.map do |slot|
      slot["template_slot"]
    end
    default_slots = DefaultSlot.any_in({template_slot: template_slots})
    default_slots_paired = {}
    default_slots.each do |slot|
      default_slots_paired[slot.template_slot] = slot
    end
    slots.map do |slot|
      unless slot["slot_id"].blank?
        default_slot               = default_slots_paired[slot["template_slot"]] || DefaultSlot.new
        default_slot.template_slot = slot["template_slot"]
        default_slot.slot_id       = slot["slot_id"]
        default_slot.save
      end
      slot["slot_id"] = nil if slot["slot_id"].blank?
      slot
    end
  end

end
