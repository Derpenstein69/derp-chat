-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  profile_picture_url TEXT,
  status_message TEXT
);

-- Update messages table to include user_id foreign key
ALTER TABLE messages ADD COLUMN user_id TEXT REFERENCES users(id);
