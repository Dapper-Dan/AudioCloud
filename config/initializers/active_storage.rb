# Configure ActiveStorage to use S3 storage
Rails.application.config.active_storage.service = :amazon

# Set the service URLs to expire in 1 hour
Rails.application.config.active_storage.service_urls_expire_in = 1.hour

# Ensure the storage directory exists
storage_path = Rails.root.join('storage')
FileUtils.mkdir_p(storage_path) unless File.exist?(storage_path)

# Set proper permissions for the storage directory
FileUtils.chmod_R(0777, storage_path) 