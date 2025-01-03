-- Create sessions table
-- This table stores session information including the session ID, user ID, timestamps, messages, IP address, and user agent.
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY, -- Unique identifier for the session
  user_id TEXT REFERENCES users(id), -- Foreign key referencing the user
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the session was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the session was last updated
  messages TEXT, -- Messages associated with the session
  ip_address TEXT, -- IP address of the user
  user_agent TEXT, -- User agent of the user's device
  user_activity_timestamps TEXT, -- Timestamps of user activities during the session
  device_information TEXT, -- Device information of the user's device
  session_duration INTEGER, -- Duration of the session in seconds
  conversation_history TEXT, -- Conversation history for context-aware responses
  user_preferences TEXT -- User preferences for personalized interactions
);
