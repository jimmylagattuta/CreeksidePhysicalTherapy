require_relative "boot"

require "rails/all"

require_relative "../app/middleware/force_www"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module LaOrthos
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # Add custom middleware for forcing www
    config.middleware.use ForceWww

    # Configuration for the application, engines, and railties goes here.
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    config.api_only = true

    # Middleware for compression
    config.middleware.use Rack::Deflater

    # If you need to use sessions and cookies, configure them correctly
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    # Set the SameSite attribute for cookies to prevent CSRF
    config.action_dispatch.cookies_same_site_protection = :lax
  end
end
