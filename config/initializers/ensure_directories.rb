# config/initializers/ensure_directories.rb

middleware_directory = Rails.root.join('app', 'middleware')
Dir.mkdir(middleware_directory) unless Dir.exist?(middleware_directory)
