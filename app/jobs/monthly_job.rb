class MonthlyJob
  include Sidekiq::Worker

  def perform
    # Load the class from the controller
    require_relative '../../controllers/api/v1/jobs_controller'

    redis = Redis.new(
      url: ENV['REDIS_URL'],
      ssl: true,
      ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
    )
    cache_key = "google_places_reviews"

    # Clear the existing cache
    redis.del(cache_key)

    # Fetch fresh reviews
    reviews = Api::V1::JobsController::GooglePlacesCached.fetch_five_star_reviews_for_companies

    # Reset the cache with new data
    redis.setex(cache_key, 30.days.to_i, reviews.to_json)
  end
end
