require_relative "boot"

require "rails/all"

require_relative "../app/middleware/force_www"

Bundler.require(*Rails.groups)

module LaOrthos
  class Application < Rails::Application
    config.load_defaults 7.0

    # Add custom middleware for forcing www
    config.middleware.use ForceWww

    # Only loads a smaller set of middleware suitable for API only apps.
    config.api_only = true

    # Middleware for compression
    config.middleware.use Rack::Deflater

    # Include middleware for cookies and sessions if needed
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
    config.action_dispatch.cookies_same_site_protection = :lax
  end
end
