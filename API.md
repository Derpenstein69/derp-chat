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

### Scoped Prompts

#### POST /scoped-prompts
- Description: Handle messages with roles such as system, user, and assistant.
- Request Body:
  ```json
  {
    "role": "system",
    "content": "Set the AI's personality and rules for behavior."
  }
  ```
- Response Body:
  ```json
  {
    "message": "Scoped prompt processed successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while processing the scoped prompt.

### Unscoped Prompts

#### POST /unscoped-prompts
- Description: Handle single questions without additional context.
- Request Body:
  ```json
  {
    "question": "What is the weather today?"
  }
  ```
- Response Body:
  ```json
  {
    "answer": "The weather today is sunny."
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while processing the unscoped prompt.

### Secure Image Request Links

#### HMAC Signature Validation
- Description: Validate HMAC signatures on image request links to ensure authenticity.
- Implementation:
  - Generate an HMAC signature using a secret key and the request parameters.
  - Compare the generated signature with the signature provided in the request.
  - If the signatures do not match, reject the request with an error response.
- Example:
  ```javascript
  const hmac = createHmac('sha256', process.env.HMAC_SECRET_KEY);
  hmac.update(requestParams);
  const signature = hmac.digest('hex');
  if (providedSignature !== signature) {
    throw new Error("Invalid HMAC signature");
  }
  ```

#### Expiration Date Enforcement
- Description: Enforce expiration dates on image request links to prevent unauthorized access.
- Implementation:
  - Include an expiration timestamp in the request parameters.
  - Compare the current time with the expiration timestamp.
  - If the current time is greater than the expiration timestamp, reject the request with an error response.
- Example:
  ```javascript
  const currentTime = new Date().getTime();
  if (currentTime > expirationTimestamp) {
    throw new Error("Link has expired");
  }
  ```

### Knowledge Seeding

#### POST /seed-knowledge
- Description: Seed knowledge documents into the system.
- Request Body:
  ```json
  {
    "documents": [
      {
        "id": "doc1",
        "content": "This is a knowledge document."
      }
    ]
  }
  ```
- Response Body:
  ```json
  {
    "message": "Knowledge seeded successfully"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while seeding knowledge.

### Knowledge Queries

#### GET /query-knowledge
- Description: Query knowledge documents based on a query string.
- Query Parameters:
  - `query`: The query string.
- Response Body:
  ```json
  {
    "response": "Generated response based on knowledge documents."
  }
  ```
- Error Responses:
  - 400 Bad Request: Query parameter is required.
  - 500 Internal Server Error: An error occurred while querying knowledge.

### Image Classification

#### POST /classify-image
- Description: Classify an image using Workers AI.
- Request Body:
  ```json
  {
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- Response Body:
  ```json
  {
    "classification": "cat"
  }
  ```
- Error Responses:
  - 400 Bad Request: Invalid input data.
  - 500 Internal Server Error: An error occurred while classifying the image.

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
