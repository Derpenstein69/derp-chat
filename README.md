# Durable Chat Template

A chat application with an AI assistant backed by a Durable Object.

## Table of contents

* Features
* Prerequisites
* Setup
* Running the project
* Running Tests
* Performance Optimization Tips
* Contributing
* License

## Features

* Chat with an AI assistant 🤖
* User authentication and profiles 🔒
* Rich media support 📷
* Real-time messaging 💬
* Search messages 🔍
* Provide feedback and ratings ⭐
* Profile customization 🎨
* Threads and replies 🧵
* Role-based access control 🔑
* File attachments 📎
* Real-time analytics and monitoring 📊
* Context-aware responses 🧠
* Personalized interactions 👤
* Multi-modal interactions 🎥

## Prerequisites

* Node.js (v14 or higher) 🟢
* npm (v6 or higher) 📦
* Cloudflare account ☁️

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/durable-chat-template.git
   cd durable-chat-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   * Use Cloudflare secrets to securely store sensitive environment variables.
   * Set the following secrets using the `wrangler secret put` command:

     ```bash
     wrangler secret put GOOGLE_CLIENT_ID
     wrangler secret put GOOGLE_CLIENT_SECRET
     wrangler secret put GITHUB_CLIENT_ID
     wrangler secret put GITHUB_CLIENT_SECRET
     wrangler secret put APPLE_CLIENT_ID
     wrangler secret put APPLE_CLIENT_SECRET
     wrangler secret put DISCORD_CLIENT_ID
     wrangler secret put DISCORD_CLIENT_SECRET
     wrangler secret put JWT_SECRET
     wrangler secret put HMAC_SECRET_KEY
     wrangler secret put R2_ACCESS_KEY_ID
     wrangler secret put R2_SECRET_ACCESS_KEY
     wrangler secret put R2_BUCKET_NAME
     wrangler secret put R2_REGION
     wrangler secret put IMAGE_CLASSIFICATION_WORKER
     wrangler secret put CLASSIFICATION_METADATA
     wrangler secret put VECTORIZE_API_KEY
     wrangler secret put VECTORIZE_ENDPOINT
     ```

4. Example environment variable values:

   ```bash
   wrangler secret put GOOGLE_CLIENT_ID 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   wrangler secret put GOOGLE_CLIENT_SECRET your-google-client-secret
   wrangler secret put GITHUB_CLIENT_ID Iv1.1234567890abcdef
   wrangler secret put GITHUB_CLIENT_SECRET your-github-client-secret
   wrangler secret put APPLE_CLIENT_ID com.example.app
   wrangler secret put APPLE_CLIENT_SECRET your-apple-client-secret
   wrangler secret put DISCORD_CLIENT_ID 123456789012345678
   wrangler secret put DISCORD_CLIENT_SECRET your-discord-client-secret
   ```

5. Configure Cloudflare Worker for logging:
   * Add the following variables to the `.env` file:

     ```
     LOGS_KV_NAMESPACE_ID=your-logs-kv-namespace-id
     ```

6. Update `wrangler.json` to include the new Cloudflare Worker:

   ```json
   {
     "routes": [
       {
         "pattern": "/logs",
         "script": "src/server/loggingWorker.ts"
       }
     ],
     "kv_namespaces": [
       {
         "binding": "LOGS",
         "id": "your-logs-kv-namespace-id"
       }
     ]
   }
   ```

## Running the project

1. Build the client:

   ```bash
   npm run build
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8787` to see the application in action.

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

This will execute all unit tests and integration tests in the project.

## Performance Optimization Tips

To optimize the performance of the chat application, consider the following tips:

1. **Implement Caching**: Use caching mechanisms to reduce the load on the database and improve response times.
2. **Optimize Database Queries**: Ensure that database queries are efficient and performant.
3. **Use a Performance Monitoring Tool**: Identify and address performance bottlenecks using a performance monitoring tool.
4. **Minimize Client-Side Rendering**: Reduce the amount of client-side rendering to improve the application's responsiveness.
5. **Optimize Asset Loading**: Use techniques like lazy loading and code splitting to optimize the loading of assets.

## Contributing

We welcome contributions! To contribute, please follow these steps:

1. Fork the repository 🍴
2. Create a new branch (`git checkout -b feature-branch`) 🌿
3. Make your changes and commit them (`git commit -m 'Add new feature'`) 💡
4. Push to the branch (`git push origin feature-branch`) 🚀
5. Create a pull request 📥

## License

This project is licensed under the MIT License. See the LICENSE file for details. 📄

## Role-based Access Control

The chat application now supports role-based access control to restrict certain actions based on user roles. For example, only administrators can delete messages or manage user profiles.

### Configuring User Roles

1. Extend the user schema to include a `role` column in the `migrations/2024-11-01_add_user_profiles.sql` file.
2. Assign roles to users during user creation and authentication in `src/server/index.ts`.
3. Add role checks in the message handling logic in `src/server/index.ts` to restrict actions based on user roles.
4. Update the client-side code in `src/client/index.tsx` to handle role-based access control and hide or disable certain UI elements based on the user's role.

## File Attachments

The chat application now supports file attachments in messages. Users can upload and share files within the chat.

### Using File Attachments

1. Extend the message schema to include an `attachments` field in the `src/shared.ts` file.
2. Update the client-side form in `src/client/index.tsx` to include a file input element for attachments.
3. Implement a file upload endpoint in the server-side code in `src/server/index.ts` to handle file uploads and return the URL of the uploaded file.
4. Update the client-side code in `src/client/index.tsx` to send the attachment URLs along with the message content when a message is sent.
5. Modify the message rendering logic in `src/client/index.tsx` to display the attached files.

## Real-time Analytics and Monitoring

The chat application now supports real-time analytics and monitoring to track and analyze message data.

### Tracking Real-time Analytics

1. Track message data such as message count, user activity, and message frequency in the `src/server/index.ts` file.
2. Create a new table in the database to store analytics data by adding a new migration file in the `migrations` directory.
3. Use WebSockets to send real-time updates to the client by broadcasting analytics data to all connected clients whenever a new message is received.
4. Update the client-side code in `src/client/index.tsx` to display real-time analytics data.

## Context-aware Responses

The chat application now supports context-aware responses by maintaining a conversation history for each user session. This allows the AI assistant to provide more relevant and coherent responses based on the context of the conversation.

### Implementing Context-aware Responses

1. Extend the `ChatMessage` and `Session` types in the `src/shared.ts` file to include fields for context-aware responses.
2. Update the server-side code in `src/server/index.ts` to maintain a conversation history for each user session and use it to generate context-aware responses.
3. Update the client-side code in `src/client/index.tsx` to handle context-aware responses and display them appropriately.

## Personalized Interactions

The chat application now supports personalized interactions by leveraging user profile information. The AI assistant can tailor its responses based on the user's preferences, interests, and past interactions.

### Implementing Personalized Interactions

1. Extend the `ChatMessage` and `Session` types in the `src/shared.ts` file to include fields for personalized interactions.
2. Update the server-side code in `src/server/index.ts` to leverage user profile information and generate personalized responses.
3. Update the client-side code in `src/client/index.tsx` to handle personalized interactions and display them appropriately.

## Multi-modal Interactions

The chat application now supports multi-modal interactions by allowing users to send and receive messages in different formats, such as text, images, and videos. The AI assistant can analyze and respond to these different formats appropriately.

### Implementing Multi-modal Interactions

1. Extend the `ChatMessage` and `Session` types in the `src/shared.ts` file to include fields for multi-modal interactions.
2. Update the server-side code in `src/server/index.ts` to handle multi-modal interactions and generate appropriate responses.
3. Update the client-side code in `src/client/index.tsx` to handle multi-modal interactions and display them appropriately.

## Caching Mechanism

The chat application now includes a caching mechanism to reduce the load on the database and improve response times.

### Setting Up Caching Mechanism

1. Extend the `ChatMessage` and `Session` types in the `src/shared.ts` file to include fields for caching.
2. Update the server-side code in `src/server/index.ts` to implement caching for frequently accessed data.
3. Update the client-side code in `src/client/index.tsx` to utilize the caching mechanism for improved performance.

## Performance Monitoring Tool

The chat application now uses a performance monitoring tool to identify and address performance bottlenecks.

### Using Performance Monitoring Tool

1. Integrate a performance monitoring tool in the `src/server/index.ts` file to track and analyze performance metrics.
2. Update the client-side code in `src/client/index.tsx` to display performance metrics and provide insights into potential bottlenecks.

## Optimized Database Queries

The chat application now includes optimized database queries to ensure efficiency and performance.

### Optimizing Database Queries

1. Review and optimize database queries in the `src/server/index.ts` file to improve performance.
2. Update the client-side code in `src/client/index.tsx` to handle optimized database queries and ensure efficient data retrieval.

## Logging Mechanism

The chat application now includes a logging mechanism to log errors to an external logging service using a Cloudflare Worker.

### Setting Up Logging Mechanism

1. Create a Cloudflare Worker to handle logging requests and store them in Cloudflare KV.
2. Update the `wrangler.json` file to include the new Cloudflare Worker and bind the Cloudflare KV namespace for logging.
3. Modify the error handling code in `src/server/index.ts` to send log data to the Cloudflare Worker whenever an error occurs.
4. Ensure that log entries are stored in Cloudflare KV in a structured JSON format, including timestamp, log level, message, context, and error details.

## Cloudflare Secrets Settings

The chat application now includes a settings menu for entering and saving Cloudflare secrets.

### Using Cloudflare Secrets Settings

1. Navigate to the settings menu in the application.
2. Enter the required Cloudflare secrets in the labeled input fields.
3. Click the "Save" button to save the secrets to Cloudflare.
4. The application will automatically validate the input and provide feedback messages to inform you about the success or failure of saving the secrets.
5. The secrets will be securely transmitted to Cloudflare and stored as environment variables.

## Enhanced Setup Instructions

To set up the chat application, follow these detailed steps:

1. **Clone the repository**: Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/your-username/durable-chat-template.git
   cd durable-chat-template
   ```

2. **Install dependencies**: Install the required dependencies using npm:

   ```bash
   npm install
   ```

3. **Configure environment variables**: Use Cloudflare secrets to securely store sensitive environment variables. Set the following secrets using the `wrangler secret put` command:

   ```bash
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   wrangler secret put APPLE_CLIENT_ID
   wrangler secret put APPLE_CLIENT_SECRET
   wrangler secret put DISCORD_CLIENT_ID
   wrangler secret put DISCORD_CLIENT_SECRET
   wrangler secret put JWT_SECRET
   wrangler secret put HMAC_SECRET_KEY
   wrangler secret put R2_ACCESS_KEY_ID
   wrangler secret put R2_SECRET_ACCESS_KEY
   wrangler secret put R2_BUCKET_NAME
   wrangler secret put R2_REGION
   wrangler secret put IMAGE_CLASSIFICATION_WORKER
   wrangler secret put CLASSIFICATION_METADATA
   wrangler secret put VECTORIZE_API_KEY
   wrangler secret put VECTORIZE_ENDPOINT
   ```

4. **Example environment variable values**: Here are some example values for the environment variables:

   ```bash
   wrangler secret put GOOGLE_CLIENT_ID 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   wrangler secret put GOOGLE_CLIENT_SECRET your-google-client-secret
   wrangler secret put GITHUB_CLIENT_ID Iv1.1234567890abcdef
   wrangler secret put GITHUB_CLIENT_SECRET your-github-client-secret
   wrangler secret put APPLE_CLIENT_ID com.example.app
   wrangler secret put APPLE_CLIENT_SECRET your-apple-client-secret
   wrangler secret put DISCORD_CLIENT_ID 123456789012345678
   wrangler secret put DISCORD_CLIENT_SECRET your-discord-client-secret
   ```

5. **Configure Cloudflare Worker for logging**: Add the following variables to the `.env` file:

   ```
   LOGS_KV_NAMESPACE_ID=your-logs-kv-namespace-id
   ```

6. **Update `wrangler.json`**: Update the `wrangler.json` file to include the new Cloudflare Worker:

   ```json
   {
     "routes": [
       {
         "pattern": "/logs",
         "script": "src/server/loggingWorker.ts"
       }
     ],
     "kv_namespaces": [
       {
         "binding": "LOGS",
         "id": "your-logs-kv-namespace-id"
       }
     ]
   }
   ```

7. **Build the client**: Build the client using the following command:

   ```bash
   npm run build
   ```

8. **Start the development server**: Start the development server using the following command:

   ```bash
   npm run dev
   ```

9. **Open the application**: Open your browser and navigate to `http://localhost:8787` to see the application in action.

## Usage Examples

Here are some usage examples to demonstrate how to use the chat application:

### Sending Messages

1. **Type a message**: In the chat input box, type your message.
2. **Send the message**: Press the "Send" button or hit "Enter" to send the message.
3. **View the message**: The message will appear in the chat window.

### Uploading Attachments

1. **Select a file**: Click the "Attachment" button to open the file picker.
2. **Choose a file**: Select the file you want to upload.
3. **Send the message**: Press the "Send" button or hit "Enter" to send the message with the attachment.
4. **View the attachment**: The attachment will appear in the chat window.

### Interacting with the AI Assistant

1. **Type a message**: In the chat input box, type your message or question for the AI assistant.
2. **Send the message**: Press the "Send" button or hit "Enter" to send the message.
3. **View the response**: The AI assistant's response will appear in the chat window.

## Expanded Explanations of Features and Components

### Real-time Messaging

The chat application supports real-time messaging, allowing users to send and receive messages instantly. This is achieved using WebSockets for real-time communication between the client and server.

### Context-aware Responses

The AI assistant provides context-aware responses by maintaining a conversation history for each user session. This allows the AI to generate more relevant and coherent responses based on the context of the conversation.

### Personalized Interactions

The AI assistant tailors its responses based on user profile information, such as preferences, interests, and past interactions. This enhances the user experience by providing more personalized and engaging interactions.
=======
## Usage Examples

### Chat with AI Assistant

To start a chat with the AI assistant, simply type a message in the input field and press "Send". The AI assistant will respond based on the context of the conversation.

Example interaction:

```
User: Hello, AI!
AI: Hello! How can I assist you today?
```

### User Authentication

To register or log in, click on the "Sign In" button and choose your preferred authentication provider (Google, GitHub, Apple, or Discord). Follow the prompts to complete the authentication process.

### Profile Customization

To customize your user profile, navigate to the profile settings page. Here, you can update your profile picture, status message, bio, location, website, and social media links.

### Real-time Messaging

To send a real-time message, type your message in the input field and press "Send". Your message will be instantly delivered to all connected users.

### Context-aware Responses

The AI assistant provides context-aware responses based on the conversation history. This ensures that the responses are relevant and coherent.

Example interaction:

```
User: What's the weather like today?
AI: The weather today is sunny with a high of 75°F.
User: What about tomorrow?
AI: Tomorrow's forecast is partly cloudy with a high of 72°F.
```

## Troubleshooting Tips

### Common Issues

1. **Installation Problems**: Ensure that you have the correct versions of Node.js and npm installed. Run `node -v` and `npm -v` to check the versions.
2. **Environment Variable Misconfigurations**: Double-check that all required environment variables are set correctly using the `wrangler secret put` command.
3. **Server Errors**: Check the server logs for any error messages and ensure that all dependencies are installed correctly.

### Error Messages

1. **Invalid Email or Password**: Ensure that you are entering the correct email and password. If you have forgotten your password, use the password reset feature.
2. **Authentication Error**: Ensure that your authentication provider credentials are correctly configured in the environment variables.

### Debugging Tips

1. **Check Logs**: Review the server logs for any error messages or stack traces that can help identify the issue.
2. **Browser Developer Tools**: Use the browser's developer tools to inspect network requests, console logs, and other debugging information.
3. **Verify Environment Variable Values**: Ensure that all environment variables are set correctly and have the expected values.

### Performance Issues

1. **Optimize Database Queries**: Review and optimize database queries to ensure efficient data retrieval.
2. **Implement Caching**: Use caching mechanisms to reduce the load on the database and improve response times.
3. **Use Performance Monitoring Tools**: Identify and address performance bottlenecks using a performance monitoring tool.

### Contact Support

If you encounter any issues or need assistance, you can contact support or seek help from the community:

* **Support Email**: support@example.com
* **Community Forum**: https://community.example.com
* **GitHub Issues**: https://github.com/your-username/durable-chat-template/issues
