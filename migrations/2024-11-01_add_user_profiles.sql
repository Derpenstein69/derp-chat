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
  social_media_links TEXT,
  role TEXT -- Add role column to store user roles
);

-- Update messages table to include user_id foreign key
-- This statement adds a foreign key column to the messages table to link each message to a user in the users table.
ALTER TABLE messages ADD COLUMN user_id TEXT REFERENCES users(id);

-- Add new columns to store thread and reply information in the messages table
ALTER TABLE messages ADD COLUMN thread_id TEXT;
ALTER TABLE messages ADD COLUMN reply_to TEXT;

-- Add session_id column to messages table to link messages to sessions
ALTER TABLE messages ADD COLUMN session_id TEXT REFERENCES sessions(session_id);
