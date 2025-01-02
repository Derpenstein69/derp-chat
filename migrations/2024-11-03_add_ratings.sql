-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  rating_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  message_id TEXT REFERENCES messages(id),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
