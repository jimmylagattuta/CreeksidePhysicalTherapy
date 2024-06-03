require_relative "boot"

require "rails/all"

require_relative '../app/middleware/force_www'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LaOrthos
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0
  

    # Ensure the middleware directory exists
    middleware_directory = Rails.root.join('app', 'middleware')
    Dir.mkdir(middleware_directory) unless Dir.exist?(middleware_directory)

    # Add custom middleware for forcing www
    require_relative '../app/middleware/force_www'
    config.middleware.use 'ForceWww'

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    config.middleware.use Rack::Deflater
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
    config.action_dispatch.cookies_same_site_protection = :lax
  end
end
