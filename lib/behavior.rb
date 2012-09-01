module Behavior
  extend ActiveSupport::Concern

  included do
    Registry << self
  end

  def initialize(context)
    @context = context
  end

  def context
    @context
  end

  def extract_slug(path)
    path.gsub(/^\//, "").split("/").first
  end

  module ClassMethods

    def map(routes)
      @routes ||= []
      unless routes.is_a? Array
        routes = [routes]
      end
      @routes += routes
    end

    def handler(render_with = nil)
      klass         = Padrino.env == :development ? self.to_s : self
      render_with ||= :render
      Proc.new do |*args|
        (klass.is_a?(String) ? klass.constantize : klass).new(self).send(render_with, args)
      end
    end

    def id
      self.to_s[0..-9].underscore
    end

    def pattern(p = nil)
      @pattern = p unless p.nil?
      @pattern || ""
    end



  end

  class Registry

    class << self

      def << (behavior)
        @behaviors ||= %w(PageBehavior ListBehavior DetailBehavior ArchiveByYearBehavior ArchiveByMonthBehavior ArchiveByDayBehavior)
        klass_name   = behavior.to_s
        if @behaviors.include? klass_name
          @behaviors[@behaviors.index(klass_name)] = behavior
        else
          @behaviors << behavior
        end
      end

      def behaviors
        @behaviors.select { |behavior|
          !behavior.is_a? String
        }.freeze
      end

    end

  end

end