class Api::V1::JobsController < ApplicationController
  rescue_from StandardError, with: :handle_unexpected_error
  rescue_from JSON::ParserError, with: :handle_json_parsing_error
  
  def index
    puts "Rendering index action..."
    render json: "Default Company " * 1000
  end

  def pull_google_places_cache
    log_daily_visits
    # puts "Fetching CSRF token..."
    csrf_token = form_authenticity_token
    # puts "CSRF token fetched: #{csrf_token}"
    # puts "Fetching cached Google Places reviews..."
    
    # Parse the reviews string into an array of hashes
    reviews_json = GooglePlacesCached.cached_google_places_reviews
    reviews = JSON.parse(reviews_json)
    
    # puts "Cached Google Places reviews fetched"
    if reviews.blank?
      # puts "No reviews found, sending alert email..."
      OfficeMailer.alert_no_reviews_email.deliver_later
    else
      reviews.each do |review|
        # puts "Name: #{review['author_name']}"
        # puts "Rating: #{review['rating']}"
        # puts "Text: #{review['text']}"
        # puts "-------------------------"
      end
    end
    render json: { reviews: reviews, csrf_token: csrf_token }
  end
  
  private

  def log_daily_visits
    today = Date.today
    visits_key = "daily_visits_#{today}"
    redis = Redis.new(url: ENV['REDIS_URL'])
    current_visits = redis.incr(visits_key)
    puts "*" * 100
    puts "Daily visits on #{today}: #{current_visits}"
    puts "*" * 100
  end
  def handle_unexpected_error(error)
    OfficeMailer.error_email("Unexpected Error", error.message).deliver_later
    render json: { error: "An unexpected error occurred." }, status: :internal_server_error
  end

  def handle_json_parsing_error(error)
    error_message = "Failed to parse JSON data: #{error.message}"
    OfficeMailer.error_email("JSON Parsing Error", error_message).deliver_later
    render json: { error: error_message }, status: :unprocessable_entity
  end
end

class GooglePlacesCached
  require 'redis'
  require 'json'
  require 'uri'
  require 'net/http'
  
  def self.remove_user_by_name(users, name)
    users.reject! { |user| user['user'] && user['user']['name'] == name }
  end

  def self.cached_google_places_reviews
    # puts "Initializing Redis connection..."
    redis = Redis.new(url: ENV['REDIS_URL'])
    # puts "Redis connection established"

    # puts "Fetching cached data..."
    cached_data = redis.get('cached_google_places_reviews')
    reviews = JSON.parse(cached_data) if cached_data

    if cached_data.present?
      # puts "Cached data found. Parsing..."
      # Parse the JSON data into an array of hashes
      users = JSON.parse(cached_data)

      # puts "Removing user with name 'Pdub ..'"
      # Call the class method to remove the user with name "Pdub .."
      remove_user_by_name(users, 'Pdub ..')
      filtered_reviews = users.select { |review| review['rating'] == 5 }

      # Convert the updated data back to a JSON string
      updated_reviews = JSON.generate(filtered_reviews)
      return updated_reviews
    end

    # puts "No cached data found."
    # puts "Fetching place IDs..."
    place_ids = ["ChIJT8nUWmzlBIgRnZluSKvaU7o", "ChIJy6GIldiP4okR-sQZEghTDSg", "ChIJt1CU6gxK0IkR4wEmOq3hYr4", "ChIJG5iRHpBhOIgRpqxsWqCW45o", "ChIJG4IRFhlSa4gRVOkjjz85dqE", "ChIJwS4aJMNCZIgRCnJm1UIi1DM", "ChIJf6kf46N1F4gRCtuy1-sFiFE", "ChIJPYnEYuIZxokROs5cvHzUe_A", "ChIJK3II3q_utYkR4B1voXTzigI", "ChIJkfcs-vB7ZIgRPIXGzSE94sQ", "ChIJKTOyIqC6ZIgRm_6vgwqt1C0", "ChIJUf1pNYumBIgRvqA-5r5JhWY", "ChIJ6UrV6tWpQYgRkhDQkPSseF4", "ChIJQ9SZk5oM3okRZhhzh4KmqV0", "ChIJccwssNidF4gRYkrpX72fqTA", "ChIJd6eSQJOZ9YgRdhGy82PWczE", "ChIJRwQnvhGFSk0RIN3V7ZxohCU", "ChIJZdP8j6G6ZIgRLowFu2-Fdco", "ChIJTfWBLxLSFogRjG83U7kxIpE", "ChIJZdP8j6G6ZIgRS0MV7drU2IE"]

    http = Net::HTTP.new("maps.googleapis.com", 443)
    http.use_ssl = true
    reviews = []
    place_ids.each do |place_id|
      puts "Fetching Google Places! Details for place ID: #{place_id}"
      encoded_place_id = URI.encode_www_form_component(place_id)
      url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{encoded_place_id}&key=#{ENV['REACT_APP_GOOGLE_PLACES_API_KEY']}")
      request = Net::HTTP::Get.new(url)
      response = http.request(request)
      body = response.read_body
      parsed_response = JSON.parse(body)

      if parsed_response['status'] == 'OK'
        # puts "Place details retrieved successfully"
        place_details = parsed_response['result']
        place_reviews = place_details.present? ? place_details['reviews'] || [] : []
        reviews.concat(place_reviews)
      else
        puts "Failed to retrieve place details for place ID: #{place_id}"
      end
    end

    # puts "Setting cached Google Places reviews..."
    redis.set("cached_google_places_reviews", JSON.generate(reviews))
    redis.expire("cached_google_places_reviews", 30.days.to_i)
    cached_reviews = redis.get("cached_google_places_reviews")
    reviews = JSON.parse(cached_reviews) if cached_reviews

    if cached_reviews.present?
      # puts "Cached reviews found. Parsing..."
      # Parse the JSON data into an array of hashes
      users = JSON.parse(cached_reviews)

      # puts "Removing user with name 'Pdub ..'"
      # Call the class method to remove the user with name "Pdub .."
      remove_user_by_name(users, 'Pdub ..')

      # Convert the updated data back to a JSON string
      updated_reviews = JSON.generate(users)
      return updated_reviews
    end

    puts "No cached reviews found."
    return { reviews: "No cached reviews" }
  end

end
