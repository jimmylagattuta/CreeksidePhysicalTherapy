class Api::V1::JobsController < ApplicationController
  def index
    render json: "Creekside Physical Therapy " * 1000
  end

  def pull_google_places_cache
    puts "Reached pull_google_places_cache action" # Add this line for debugging
    csrf_token = form_authenticity_token
    puts "CSRF token: #{csrf_token}" # Add this line for debugging
    place_names = ["Creekside Physical Therapy ", "Creekside Physical Therapy  - Default City", "Creekside Physical Therapy  - Default City"]
    reviews = []

    place_names.each do |place_name|
      place_id = find_place_id(place_name)
      if place_id
        place_reviews = fetch_place_reviews(place_id)
        five_star_reviews = filter_reviews_by_rating(place_reviews, 5) # Filter by perfect rating (5 stars)
        filtered_reviews = filter_reviews_by_text(five_star_reviews, 'negative reviews') # Filter out sentences containing "negative reviews" in their text
        reviews.concat(filtered_reviews)
      else
        puts "Place ID not found for '#{place_name}'"
      end
    end

    puts "Retrieved reviews: #{reviews}" # Add this line for debugging
    render json: { reviews: reviews, csrf_token: csrf_token }
  end


  private
  require 'redis'
  require 'json'
  require 'uri'
  require 'net/http'
  def find_place_id(name)
    url = URI("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=#{URI.encode_www_form_component(name)}&inputtype=textquery&fields=place_id&key=#{ENV['REACT_APP_GOOGLE_PLACES_API_KEY']}")
    response = Net::HTTP.get_response(url)
    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      if data['candidates'] && !data['candidates'].empty?
        return data['candidates'][0]['place_id']
      end
    else
      puts "Error occurred while searching for place ID: #{response.code} - #{response.message}"
    end
    nil
  end

  def fetch_place_reviews(place_id)
    cache_key = "google_places_reviews_#{place_id}"
    cached_reviews = Rails.cache.read(cache_key)
    if cached_reviews
      puts "Fetching cached reviews for place_id: #{place_id}"
      return cached_reviews
    else
      puts "Fetching new reviews for place_id: #{place_id}"
      url = URI("https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&fields=reviews&key=#{ENV['REACT_APP_GOOGLE_PLACES_API_KEY']}")
      response = Net::HTTP.get_response(url)
      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)
        if data['result'] && data['result']['reviews']
          reviews = data['result']['reviews']
          Rails.cache.write(cache_key, reviews, expires_in: 1.day)
          return reviews
        end
      else
        puts "Error occurred while fetching place reviews: #{response.code} - #{response.message}"
      end
    end
    []
  end

  def filter_reviews_by_rating(reviews, rating)
    reviews.select { |review| review['rating'] == rating }
  end

  def filter_reviews_by_text(reviews, text_to_remove)
    reviews.map do |review|
      sentences = review['text'].split(/(?<=[.!?])\s+(?=[a-zA-Z])/)
      filtered_sentences = sentences.reject { |sentence| sentence.include?(text_to_remove) }
      review['text'] = filtered_sentences.join(' ')
      review
    end
  end
end
