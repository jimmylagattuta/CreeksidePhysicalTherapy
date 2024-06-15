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

class GooglePlacesCached
  require 'redis'
  require 'json'
  require 'uri'
  require 'net/http'
  require 'openssl'

  def self.fetch_five_star_reviews_for_companies
    begin
      puts "Fetching five-star reviews for companies..."
      companies = {
        "Creekside Physical Therapy" => ["ChIJT8nUWmzlBIgRnZluSKvaU7o", "ChIJy6GIldiP4okR-sQZEghTDSg"],
        "Northwest Extremity Specialists" => ["ChIJf07ARPkJlVQRJCA-9wte444", "ChIJi3RsjPEMlVQRt1cOeU3_g48"]
      }

      api_key = ENV['REACT_APP_GOOGLE_PLACES_API_KEY']
      reviews = {}

      companies.each do |company, place_ids|
        puts "Fetching reviews for company: #{company}"
        company_reviews = place_ids.flat_map do |place_id|
          puts "Fetching reviews for place ID: #{place_id}"
          fetch_five_star_reviews_for_place_id(place_id, api_key)
        end.compact

        # Only add to the reviews hash if there are valid reviews
        if company_reviews.any?
          reviews[company] = company_reviews
        end

        puts "Fetched reviews for company: #{company}"
      end

      puts "Fetched reviews: #{reviews.inspect}"
      reviews
    rescue StandardError => e
      puts "Error fetching five-star reviews for companies: #{e.message}"
      {}
    end
  end

  private

  def self.fetch_five_star_reviews_for_place_id(place_id, api_key)
    uri = URI("https://maps.googleapis.com/maps/api/place/details/json?placeid=#{place_id}&key=#{api_key}")
    response = Net::HTTP.get(uri)
    data = JSON.parse(response)

    if data["result"] && data["result"]["reviews"]
      data["result"]["reviews"].select { |review| review["rating"] == 5 }.map do |review|
        { author_name: review["author_name"], text: review["text"], rating: review["rating"] }
      end
    else
      puts "No reviews found for place ID: #{place_id}"
      []
    end
  rescue JSON::ParserError => e
    puts "JSON parsing error for place ID #{place_id}: #{e.message}"
    []
  end
end
