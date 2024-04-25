class MonthlyJob
  include Sidekiq::Worker

  def perform
    require 'uri'
    require 'net/http'
    require 'json'
    require 'redis'
    # Define your list of place IDs and locations
    places = ["ChIJT8nUWmzlBIgRnZluSKvaU7o", "ChIJy6GIldiP4okR-sQZEghTDSg", "ChIJt1CU6gxK0IkR4wEmOq3hYr4", "ChIJG5iRHpBhOIgRpqxsWqCW45o", "ChIJG4IRFhlSa4gRVOkjjz85dqE", "ChIJwS4aJMNCZIgRCnJm1UIi1DM", "ChIJf6kf46N1F4gRCtuy1-sFiFE", "ChIJPYnEYuIZxokROs5cvHzUe_A", "ChIJK3II3q_utYkR4B1voXTzigI", "ChIJkfcs-vB7ZIgRPIXGzSE94sQ", "ChIJKTOyIqC6ZIgRm_6vgwqt1C0", "ChIJUf1pNYumBIgRvqA-5r5JhWY", "ChIJ6UrV6tWpQYgRkhDQkPSseF4", "ChIJQ9SZk5oM3okRZhhzh4KmqV0", "ChIJccwssNidF4gRYkrpX72fqTA", "ChIJd6eSQJOZ9YgRdhGy82PWczE", "ChIJRwQnvhGFSk0RIN3V7ZxohCU", "ChIJZdP8j6G6ZIgRLowFu2-Fdco", "ChIJTfWBLxLSFogRjG83U7kxIpE", "ChIJZdP8j6G6ZIgRS0MV7drU2IE"]
    http = Net::HTTP.new("maps.googleapis.com", 443)
    http.use_ssl = true
    reviews = []

    places.each do |place|
      place_id = place

      # Fetch place details from Google Places API
      encoded_place_id = URI.encode_www_form_component(place_id)
      url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{encoded_place_id}&key=#{ENV['REACT_APP_GOOGLE_PLACES_API_KEY']}")
      request = Net::HTTP::Get.new(url)
      response = http.request(request)
      body = response.read_body
      parsed_response = JSON.parse(body)
      if parsed_response['status'] == 'OK'
        # puts "Successfully fetched place details for place ID: #{place_id}"
        # puts "Parsed response:"
        # puts parsed_response.inspect
        place_details = parsed_response['result']
        # puts "Place details:"
        # puts place_details.inspect
        place_reviews = place_details.present? ? place_details['reviews'] || [] : []
        # puts "Place reviews:"
        # puts place_reviews.inspect
        # puts "Merging reviews..."
        # puts "Reviews before merging:"
        # puts reviews.inspect
        reviews.concat(place_reviews)
        # puts "Reviews after merging:"
        # puts reviews.inspect
      else
        puts "Failed to retrieve place details for place ID: #{place_id}"
      end
    end

    # Filter and process the reviews as needed
    filtered_reviews = []
    reviews.each do |review|
      # puts "Applying review filtering logic..."
      # You can apply filtering or processing logic here
      if review['rating'] == 5 && review['author_name'] != 'Pdub ..'
        filtered_reviews << review
      end
    end


    require 'redis'

    redis = Redis.new(url: ENV['REDIS_URL'])
    
    begin
      # puts redis.ping  # Test the connection
    rescue => e
      puts "Failed to connect to Redis: #{e.message}"
    end
    
    
    if redis.exists('cached_google_places_reviews')
      # puts "Cached reviews found. Clearing previous cache..."
      redis.del('cached_google_places_reviews')
      # puts "Previous cache cleared."
    end
    # puts "Caching filtered reviews..."
    


    
    
    begin
      redis.set('cached_google_places_reviews', JSON.generate(filtered_reviews))
      # puts "cached_google_places_reviews successful." # Added logging statement
    rescue => e
      puts "Error caching: #{e.message}" # Log the error message
      # Optionally, you can re-raise the exception to propagate it further
      # raise e
    end
    # puts "Filtered reviews cached successfully."
    # puts "Setting expiration for cache..."
    redis.expire('cached_google_places_reviews', 30.days.to_i)
    # puts "Cache expiration set successfully."
  rescue StandardError => e
    puts "Error in MonthlyJob: #{e.message}"
  end
end
