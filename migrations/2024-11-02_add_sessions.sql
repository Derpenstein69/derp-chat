-- Create sessions table
-- This table stores session information including the session ID, user ID, timestamps, messages, IP address, and user agent.
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  messages TEXT,
  ip_address TEXT,
  user_agent TEXT
);
