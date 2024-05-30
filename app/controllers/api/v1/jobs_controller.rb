class Api::V1::JobsController < ApplicationController
  rescue_from StandardError, with: :handle_unexpected_error
  rescue_from JSON::ParserError, with: :handle_json_parsing_error

  def index
    puts "Rendering index action..."
    render json: "Creekside Physical Therapy" * 1000
  end

  def pull_google_places_cache
    begin
      puts "Fetching Google Places cache..."
      redis = Redis.new(
        url: ENV['REDIS_URL'],
        ssl: true,
        ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
      )
      cache_key = "google_places_reviews"
  
      cached_reviews = redis.get(cache_key)
      if cached_reviews
        puts "Using cached reviews"
        reviews = JSON.parse(cached_reviews)
      else
        puts "Fetching fresh reviews from Google Places API"
        reviews = GooglePlacesCached.fetch_five_star_reviews_for_companies
        redis.setex(cache_key, 7.days.to_i, reviews.to_json)
      end
  
      creekside_reviews = reviews["Creekside Physical Therapy"] || []
      northwest_reviews = reviews["Northwest Extremity Specialists"] || []
  
      csrf_token = form_authenticity_token
      render json: { creekside_reviews: creekside_reviews, northwest_reviews: northwest_reviews, csrf_token: csrf_token }
    rescue StandardError => e
      puts "Error fetching Google Places cache: #{e.message}"
      OfficeMailer.error_email("Google Places Cache Error", e.message).deliver_later
      render json: { error: "An error occurred while fetching Google Places cache: #{e.message}" }, status: :internal_server_error
    end
  end
  

  private

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
        "Creekside Physical Therapy" => ["ChIJT8nUWmzlBIgRnZluSKvaU7o", "ChIJy6GIldiP4okR-sQZEghTDSg", "ChIJt1CU6gxK0IkR4wEmOq3hYr4", "ChIJ4ehfGL8JlVQR3QwufLzN5SI", "ChIJ_U-CjPEMlVQRLymo_u5om1o", "ChIJI7hPTTYNlVQRmK-_GuttTHs"],
        "Northwest Extremity Specialists" => ["ChIJf07ARPkJlVQRJCA-9wte444", "ChIJi3RsjPEMlVQRt1cOeU3_g48", "ChIJSRSts-CglVQRfXCyBEPzHNg"]
      }

      api_key = ENV['REACT_APP_GOOGLE_PLACES_API_KEY']
      reviews = {}

      redis = Redis.new(url: ENV['REDIS_URL'], ssl: true, ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
      cache_key = "google_places_reviews"

      cached_reviews = redis.get(cache_key)
      if cached_reviews
        puts "Using cached reviews"
        reviews = JSON.parse(cached_reviews)
      else
        puts "Fetching fresh reviews from Google Places API"
        reviews = fetch_reviews_from_google(companies, api_key)
        redis.setex(cache_key, 30.days.to_i, reviews.to_json)
      end

      reviews
    rescue StandardError => e
      puts "Error fetching five-star reviews for companies: #{e.message}"
      {}
    end
  end

  def self.fetch_reviews_from_google(companies, api_key)
    begin
      puts "Fetching reviews from Google..."
      reviews = {}
      redis = Redis.new(url: ENV["REDIS_URL"])

      companies.each do |company, place_ids|
        puts "Fetching reviews for company: #{company}"
        reviews[company] = place_ids.flat_map do |place_id|
          puts "Fetching reviews for place ID: #{place_id}"
          review_key = "reviews:#{company}:#{place_id}"
          review_details = redis.get(review_key)

          if review_details
            puts "Review details for place ID #{place_id}: #{review_details}"
          else
            puts "No reviews found for place ID #{place_id}"
          end

          fresh_reviews = fetch_five_star_reviews_for_place_id(place_id, api_key)

          redis.del(review_key)
          puts "Deleted review key: #{review_key}"

          fresh_reviews
        end
        puts "Successfully fetched and updated reviews for company: #{company}"
      end

      reviews
    rescue StandardError => e
      puts "Error fetching reviews from Google: #{e.message}"
      {}
    end
  end

  private

  def self.fetch_five_star_reviews_for_place_id(place_id, api_key)
    begin
      puts "Fetching five-star reviews for place ID: #{place_id}"
      http = Net::HTTP.new("maps.googleapis.com", 443)
      http.use_ssl = true
      url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&fields=reviews&key=#{api_key}")
      request = Net::HTTP::Get.new(url)
      response = http.request(request)
      data = JSON.parse(response.body)

      if data['status'] == 'OK'
        reviews = data['result']['reviews'] || []
        reviews.select { |review| review['rating'] == 5 }.each do |review|
          puts " - #{review['author_name']}: #{review['text']}"
        end
        reviews.select { |review| review['rating'] == 5 }
      else
        puts "Error fetching reviews for Place ID #{place_id}: #{data['status']}"
        []
      end
    rescue StandardError => e
      puts "Error fetching five-star reviews for place ID: #{place_id}: #{e.message}"
      []
    end
  end
end
