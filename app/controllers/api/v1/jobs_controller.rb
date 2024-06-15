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
        if reviews.empty?
          puts "Cached reviews are empty, fetching fresh reviews..."
          reviews = fetch_and_cache_reviews(redis, cache_key)
        else
          puts "Reviews fetched from cache: #{reviews.inspect}"
        end
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
    if reviews.empty?
      puts "No reviews fetched, not updating cache."
    else
      redis.setex(cache_key, 30.days.to_i, reviews.to_json)
      puts "Stored fresh reviews: #{reviews.inspect}"
    end
    reviews
  end

  def handle_unexpected_error(error)
    puts "Handling unexpected error: #{error.message}"
    OfficeMailer.error_email("Unexpected Error", error.message).deliver_later
    render json: { error: "An unexpected error occurred: #{error


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
        reviews[company] = place_ids.flat_map do |place_id|
          puts "Fetching reviews for place ID: #{place_id}"
          fetch_five_star_reviews_for_place_id(place_id, api_key)
        end
        puts "Fetched reviews for company: #{company}"
      end

      # Remove any empty entries
      reviews.reject! { |_, v| v.empty? }
      
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
      five_star_reviews = data["result"]["reviews"].select { |review| review["rating"] == 5 }
      five_star_reviews.map { |review| { author_name: review["author_name"], text: review["text"], rating: review["rating"] } }
    else
      puts "No reviews found for place ID: #{place_id}"
      []
    end
  end
end
