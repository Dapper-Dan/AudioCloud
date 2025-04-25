#!/bin/bash

# Exit on error
set -e

# Install system dependencies
echo "Installing system dependencies..."
apt-get update -qq
apt-get install -y postgresql-client libpq-dev

# Install Ruby dependencies
echo "Installing Ruby dependencies..."
bundle config build.pg --with-pg-config=/usr/bin/pg_config
bundle install

# Precompile assets
echo "Precompiling assets..."
bundle exec rake assets:precompile

# Run database migrations
echo "Running database migrations..."
bundle exec rake db:migrate 