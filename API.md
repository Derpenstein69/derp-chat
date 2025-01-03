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
