# Database Schema Documentation

This document provides an overview of the database schema used in the Durable Chat application. It includes details about the tables, columns, and relationships.

## Tables

### Users Table

The `users` table stores user profiles and related information.

| Column               | Type   | Description                                      |
|----------------------|--------|--------------------------------------------------|
| `id`                 | TEXT   | Primary key, unique identifier for the user.     |
| `name`               | TEXT   | Name of the user.                                |
| `email`              | TEXT   | Unique email address of the user.                |
| `profile_picture_url`| TEXT   | URL of the user's profile picture.               |
| `status_message`     | TEXT   | Status message of the user.                      |
| `bio`                | TEXT   | Bio of the user.                                 |
| `location`           | TEXT   | Location of the user.                            |
| `website`            | TEXT   | Website of the user.                             |
| `social_media_links` | TEXT   | Social media links of the user.                  |
| `role`               | TEXT   | Role of the user (e.g., admin, user).            |
| `theme`              | TEXT   | Theme preferences of the user.                   |
| `avatar`             | TEXT   | Avatar preferences of the user.                  |
| `interaction_style`  | TEXT   | Interaction style preferences of the user.       |

### Messages Table

The `messages` table stores chat messages and related information.

| Column        | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| `id`          | TEXT   | Primary key, unique identifier for the message.  |
| `user`        | TEXT   | Name of the user who sent the message.           |
| `role`        | TEXT   | Role of the user (e.g., user, assistant).        |
| `content`     | TEXT   | Content of the message.                          |
| `attachments` | TEXT   | Attachments associated with the message.         |
| `user_id`     | TEXT   | Foreign key, references `users(id)`.             |
| `thread_id`   | TEXT   | Identifier for the message thread.               |
| `reply_to`    | TEXT   | Identifier for the message being replied to.     |
| `session_id`  | TEXT   | Foreign key, references `sessions(session_id)`.  |

### Sessions Table

The `sessions` table stores session information and related data.

| Column                    | Type      | Description                                      |
|---------------------------|-----------|--------------------------------------------------|
| `session_id`              | TEXT      | Primary key, unique identifier for the session.  |
| `user_id`                 | TEXT      | Foreign key, references `users(id)`.             |
| `created_at`              | TIMESTAMP | Timestamp when the session was created.          |
| `updated_at`              | TIMESTAMP | Timestamp when the session was last updated.     |
| `messages`                | TEXT      | Messages associated with the session.            |
| `ip_address`              | TEXT      | IP address of the user.                          |
| `user_agent`              | TEXT      | User agent of the user's device.                 |
| `user_activity_timestamps`| TEXT      | Timestamps of user activities during the session.|
| `device_information`      | TEXT      | Device information of the user's device.         |
| `session_duration`        | INTEGER   | Duration of the session in seconds.              |
| `conversation_history`    | TEXT      | Conversation history for context-aware responses.|
| `user_preferences`        | TEXT      | User preferences for personalized interactions.  |

### Ratings Table

The `ratings` table stores ratings provided by users for messages.

| Column        | Type      | Description                                      |
|---------------|-----------|--------------------------------------------------|
| `rating_id`   | TEXT      | Primary key, unique identifier for the rating.   |
| `user_id`     | TEXT      | Foreign key, references `users(id)`.             |
| `message_id`  | TEXT      | Foreign key, references `messages(id)`.          |
| `rating_value`| INTEGER   | Rating value (1-5).                              |
| `timestamp`   | TIMESTAMP | Timestamp when the rating was provided.          |
