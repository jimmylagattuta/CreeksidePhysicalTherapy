# app/middleware/force_www.rb
class ForceWww
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
  