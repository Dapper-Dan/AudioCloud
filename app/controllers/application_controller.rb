class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token
    helper_method :current_user, :logged_in?
  
    if Rails.env.development? || Rails.env.production?
        before_action :allow_iframe_from_localhost
    end
  
    private
  
    def allow_iframe_from_localhost
        response.headers.delete('X-Frame-Options')
        response.headers['Content-Security-Policy'] = "frame-ancestors 'self' http://localhost:3000"
    end
  
    def current_user
        return nil unless session[:session_token]
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def current_song
        return nil unless session[:s]
    end
  
    def logged_in?
        !!current_user
    end
  
    def login(user)
        session[:session_token] = user.session_token
        @current_user = user
    end
  
    def logout
        current_user.reset_session_token!
        session[:session_token] = nil
        @current_user = nil
    end
  
    def require_logged_in
        unless current_user
            render json: { base: ['invalid credentials'] }, status: 401
        end
    end
end
  