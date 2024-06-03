class WwwMiddleware
    def initialize(app)
      @app = app
    end
  
    def call(env)
      request = Rack::Request.new(env)
  
      if request.host == 'creeksidephysicaltherapy.com'
        [301, { 'Location' => request.url.sub('//', '//www.') }, ['Redirecting...']]
      else
        @app.call(env)
      end
    end
  end
  
  Rails.application.config.middleware.use WwwMiddleware