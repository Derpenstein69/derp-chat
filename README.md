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
   * Create a `.env` file in the root directory.
   * Add the following variables:
     ```
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     GITHUB_CLIENT_ID=your-github-client-id
     GITHUB_CLIENT_SECRET=your-github-client-secret
     APPLE_CLIENT_ID=your-apple-client-id
     APPLE_CLIENT_SECRET=your-apple-client-secret
     DISCORD_CLIENT_ID=your-discord-client-id
     DISCORD_CLIENT_SECRET=your-discord-client-secret
     ```

4. Example environment variable values:
   ```
   GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=Iv1.1234567890abcdef
   GITHUB_CLIENT_SECRET=your-github-client-secret
   APPLE_CLIENT_ID=com.example.app
   APPLE_CLIENT_SECRET=your-apple-client-secret
   DISCORD_CLIENT_ID=123456789012345678
   DISCORD_CLIENT_SECRET=your-discord-client-secret
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
