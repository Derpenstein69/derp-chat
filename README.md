# Durable Chat Template

A chat application with an AI assistant backed by a Durable Object.

## Table of contents

* Features
* Prerequisites
* Setup
* Running the project
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
