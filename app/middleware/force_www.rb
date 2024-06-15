# app/middleware/force_www.rb
class ForceWww
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)

    Rails.logger.info("ForceWww middleware: #{request.url}")

    if request.host == 'creeksidephysicaltherapy.com'
      redirect_to_www(request)
    else
      @app.call(env)
    end
  end

  private

  def redirect_to_www(request)
    [301, { 'Location' => request.url.sub('//', '//www.') }, ['Redirecting...']]
  end
end
