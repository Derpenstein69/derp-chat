# API Documentation

This document provides an overview of the API endpoints, request/response formats, and authentication methods used in the project.

## API Endpoints

### User Authentication

#### POST /auth/login
- Description: Authenticate a user and obtain a JWT token.
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response Body:
  ```json
  {
    "token": "jwt-token"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid email or password.
  - 500 Internal Server Error: An error occurred while processing the request.

#### POST /auth/register
- Description: Register a new user.
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- Response Body:
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while processing the request.

### Chat Messages

#### GET /messages
- Description: Retrieve all chat messages.
- Response Body:
  ```json
  [
    {
      "id": "message-id",
      "user": "Alice",
      "content": "Hello",
      "attachments": []
    }
  ]
  ```
- Error Responses:
  - 500 Internal Server Error: An error occurred while retrieving messages.

#### POST /messages
- Description: Send a new chat message.
- Request Body:
  ```json
  {
    "content": "Hello",
    "attachments": []
  }
  ```
- Response Body:
  ```json
  {
    "id": "message-id",
    "user": "Alice",
    "content": "Hello",
    "attachments": []
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while sending the message.

### User Profiles

#### GET /profiles/:userId
- Description: Retrieve a user's profile.
- Response Body:
  ```json
  {
    "id": "user-id",
    "name": "Alice",
    "email": "alice@example.com",
    "profile_picture_url": "https://example.com/picture.jpg",
    "status_message": "Online",
    "bio": "Hello, I'm Alice!",
    "location": "Wonderland",
    "website": "https://alice.example.com",
    "social_media_links": "https://twitter.com/alice"
  }
  ```
- Error Responses:
  - 404 Not Found: User not found.
  - 500 Internal Server Error: An error occurred while retrieving the profile.

#### PUT /profiles/:userId
- Description: Update a user's profile.
- Request Body:
  ```json
  {
    "name": "Alice",
    "profile_picture_url": "https://example.com/picture.jpg",
    "status_message": "Online",
    "bio": "Hello, I'm Alice!",
    "location": "Wonderland",
    "website": "https://alice.example.com",
    "social_media_links": "https://twitter.com/alice"
  }
  ```
- Response Body:
  ```json
  {
    "message": "Profile updated successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 404 Not Found: User not found.
  - 500 Internal Server Error: An error occurred while updating the profile.

### Ratings

#### POST /ratings
- Description: Submit a rating for a message.
- Request Body:
  ```json
  {
    "messageId": "message-id",
    "rating": 5
  }
  ```
- Response Body:
  ```json
  {
    "message": "Rating submitted successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while submitting the rating.

### Caching Mechanism

#### GET /cache/:key
- Description: Retrieve cached data by key.
- Response Body:
  ```json
  {
    "key": "cache-key",
    "data": "cached-data"
  }
  ```
- Error Responses:
  - 404 Not Found: Cache key not found.
  - 500 Internal Server Error: An error occurred while retrieving cached data.

#### POST /cache
- Description: Store data in the cache.
- Request Body:
  ```json
  {
    "key": "cache-key",
    "data": "data-to-cache"
  }
  ```
- Response Body:
  ```json
  {
    "message": "Data cached successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while storing data in the cache.

### Performance Monitoring

#### GET /performance/metrics
- Description: Retrieve performance metrics.
- Response Body:
  ```json
  {
    "metrics": {
      "responseTime": "100ms",
      "requestsPerSecond": 10
    }
  }
  ```
- Error Responses:
  - 500 Internal Server Error: An error occurred while retrieving performance metrics.

### Optimized Database Queries

#### GET /optimized-queries/messages
- Description: Retrieve messages using optimized database queries.
- Response Body:
  ```json
  [
    {
      "id": "message-id",
      "user": "Alice",
      "content": "Hello",
      "attachments": []
    }
  ]
  ```
- Error Responses:
  - 500 Internal Server Error: An error occurred while retrieving messages.

### Context-aware Responses

#### POST /context-aware-responses
- Description: Generate context-aware responses based on conversation history.
- Request Body:
  ```json
  {
    "sessionId": "session-id",
    "message": "user-message"
  }
  ```
- Response Body:
  ```json
  {
    "response": "context-aware-response"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while generating context-aware responses.

### Personalized Responses

#### POST /personalized-responses
- Description: Generate personalized responses based on user profile information.
- Request Body:
  ```json
  {
    "userId": "user-id",
    "message": "user-message"
  }
  ```
- Response Body:
  ```json
  {
    "response": "personalized-response"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while generating personalized responses.

### Context-aware Message Summary

#### POST /context-aware-message-summary
- Description: Provide a summary of the conversation history for a given session.
- Request Body:
  ```json
  {
    "sessionId": "session-id"
  }
  ```
- Response Body:
  ```json
  {
    "summary": "conversation-summary"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while generating the conversation summary.

### Context-aware Suggestions

#### POST /context-aware-suggestions
- Description: Offer suggestions for responses based on the conversation history and user preferences.
- Request Body:
  ```json
  {
    "sessionId": "session-id",
    "userPreferences": {
      "theme": "dark",
      "avatar": "robot",
      "interaction_style": "friendly"
    }
  }
  ```
- Response Body:
  ```json
  {
    "suggestions": ["suggestion1", "suggestion2"]
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while generating suggestions.

### Context-aware Sentiment Analysis

#### POST /context-aware-sentiment-analysis
- Description: Analyze the sentiment of the conversation history to adjust the tone and style of the AI assistant's responses.
- Request Body:
  ```json
  {
    "sessionId": "session-id"
  }
  ```
- Response Body:
  ```json
  {
    "sentiment": "positive"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while analyzing sentiment.

## Request/Response Formats

- All requests and responses use JSON format.
- The request body should be sent as a JSON object.
- The response body will be returned as a JSON object.

## Authentication Methods

- The API uses JWT tokens for authentication.
- To authenticate a request, include the JWT token in the `Authorization` header:
  ```
  Authorization: Bearer jwt-token
  ```
- The JWT token is obtained by logging in or registering a new user.