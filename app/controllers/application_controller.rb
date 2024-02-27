class ApplicationController < ActionController::Base
  include ActionController::Cookies
  before_action :authenticate_user
  before_action :cors_preflight_check
  after_action :cors_set_access_control_headers
  protect_from_forgery with: :null_session

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_record

  def cors_set_access_control_headers
    allowed_origins = ['https://creekside-physical-therapy-3c43d5dad481.herokuapp.com']
    origin = request.headers['Origin']
    headers['Access-Control-Allow-Origin'] = allowed_origins.include?(origin) ? origin : ''
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    headers['Access-Control-Max-Age'] = '31536000'
  end
  
  def cors_preflight_check
    return unless request.method == 'OPTIONS'

    allowed_origins = ['https://creekside-physical-therapy-3c43d5dad481.herokuapp.com'] # Add any additional allowed origins as needed
    headers['Access-Control-Allow-Origin'] = allowed_origins.include?(request.headers['Origin']) ? request.headers['Origin'] : ''
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'
    headers['Access-Control-Max-Age'] = '31536000'

    head :ok
  end

  def redirect_to_root
    redirect_to root_path
  end

  private

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-CSRF-Token'])
  end

  def current_user
    # Implement your logic to retrieve the current user
  end

  def record_not_found(errors)
    # Handle the ActiveRecord::RecordNotFound error
  end

  def invalid_record(invalid)
    # Handle the ActiveRecord::RecordInvalid error
  end

  def authenticate_user
    # Implement your logic to authenticate the user
    # Uncomment the following line if you want to restrict unauthorized access
    # render json: 'Not authorized', status: :unauthorized unless current_user
  end
end
