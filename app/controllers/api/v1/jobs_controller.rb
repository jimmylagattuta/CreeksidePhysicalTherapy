class Api::V1::JobsController < ApplicationController
  rescue_from StandardError, with: :handle_unexpected_error
  rescue_from JSON::ParserError, with: :handle_json_parsing_error

  def pull_google_places_cache
    begin
      puts "Fetching Google Places cache..."
      redis = Redis.new(
        url: ENV['REDIS_TLS_URL'],
        ssl: true,
        ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
      )
      cache_key = "google_places_reviews"

      cached_reviews = redis.get(cache_key)
      if cached_reviews
        puts "Cached reviews found"
        reviews = JSON.parse(cached_reviews)
        puts "Reviews fetched from cache: #{reviews.inspect}"
      else
        puts "No cached reviews found, fetching fresh reviews..."
        reviews = fetch_and_cache_reviews(redis, cache_key)
      end

      csrf_token = form_authenticity_token
      render json: { reviews: reviews.values.flatten, csrf_token: csrf_token } # Ensure reviews are flattened
    rescue StandardError => e
      puts "Error fetching Google Places cache: #{e.message}"
      OfficeMailer.error_email("Google Places Cache Error", e.message).deliver_later
      render json: { error: "An error occurred while fetching Google Places cache: #{e.message}" }, status: :internal_server_error
    end
  end

  private

  def fetch_and_cache_reviews(redis, cache_key)
    reviews = GooglePlacesCached.fetch_five_star_reviews_for_companies
    redis.setex(cache_key, 30.days.to_i, reviews.to_json)
    puts "Stored fresh reviews: #{reviews.inspect}"
    reviews
  end

  def handle_unexpected_error(error)
    puts "Handling unexpected error: #{error.message}"
    OfficeMailer.error_email("Unexpected Error", error.message).deliver_later
    render json: { error: "An unexpected error occurred: #{error.message}" }, status: :internal_server_error
  end

  def handle_json_parsing_error(error)
    puts "Handling JSON parsing error: #{error.message}"
    error_message = "Failed to parse JSON: #{error.message}"
    OfficeMailer.error_email("JSON Parsing Error", error_message).deliver_later
    render json: { error: error_message }, status: :unprocessable_entity
  end
end
