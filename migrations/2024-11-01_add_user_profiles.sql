-- Create users table
-- This table stores user profiles including their name, email, profile picture URL, status message, bio, location, website, and social media links.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  profile_picture_url TEXT,
  status_message TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_media_links TEXT
);

-- Update messages table to include user_id foreign key
-- This statement adds a foreign key column to the messages table to link each message to a user in the users table.
ALTER TABLE messages ADD COLUMN user_id TEXT REFERENCES users(id);
