if ENV['RUN_SCHEDULER'] == 'true' && defined?(Sidekiq)
  require 'rufus-scheduler'
  require 'sidekiq-scheduler'
  require 'redis'
  require 'json'
  require 'uri'
  require 'net/http'
  scheduler = Rufus::Scheduler.new

  scheduler.every '30d', overlap: false do
    puts "*_*_" * 10
    puts "monthly job has triggered"
    redis = Redis.new(url: ENV['REDIS_URL'], timeout: 0.7)
    puts "Connected to Redis: #{redis.inspect}"

    # Clear the cache for each place name
    place_names = ["Creekside Physical Therapy ", "Creekside Physical Therapy  - La Grange", "Creekside Physical Therapy  - Chicago"]
    place_names.each do |place_name|
      place_id = find_place_id(place_name)
      if place_id
        cache_key = "google_places_reviews_#{place_id}"
        redis.del(cache_key)
        puts "Cleared cache for #{place_name}"
      else
        puts "Place ID not found for '#{place_name}'"
      end
    end

    # Retrieve and cache the five-star reviews for each place
    place_names.each do |place_name|
      place_id = find_place_id(place_name)
      if place_id
        place_reviews = fetch_place_reviews(place_id)
        five_star_reviews = filter_reviews_by_rating(place_reviews, 5)
        cache_key = "google_places_reviews_#{place_id}"
        redis.set(cache_key, five_star_reviews.to_json, ex: 86400) # Cache for 1 day (86400 seconds)
        puts "Cached five-star reviews for #{place_name}"
      else
        puts "Place ID not found for '#{place_name}'"
      end
    end

    puts "*_*_" * 10
  end
end
