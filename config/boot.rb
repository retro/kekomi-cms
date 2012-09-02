# Defines our constants
PADRINO_ENV  = ENV['PADRINO_ENV'] ||= ENV['RACK_ENV'] ||= 'development'  unless defined?(PADRINO_ENV)
PADRINO_ROOT = File.expand_path('../..', __FILE__) unless defined?(PADRINO_ROOT)

# Load our dependencies
require 'rubygems' unless defined?(Gem)
require 'bundler/setup'
Bundler.require(:default, PADRINO_ENV)

require 'jsonify/tilt'

##
# Enable devel logging
#
# Padrino::Logger::Config[:development][:log_level]  = :devel
# Padrino::Logger::Config[:development][:log_static] = true
#

##
# Add your before load hooks here
#
Padrino.before_load do
end

##
# Add your after load hooks here
#
Padrino.after_load do
  #Admin.prerequisites << Padrino.root('theme/models/**/*.rb')
  Kekomi::ContentTypes.base = ContentItem
  Padrino.require_dependencies(Padrino.root("theme/models/**/*.rb"))
  Kaminari.configure do |config|
    config.default_per_page = 50
    # config.window = 4
    # config.outer_window = 0
    # config.left = 0
    # config.right = 0
    # config.page_method_name = :page
    # config.param_name = :page
  end
end
Padrino.load!
