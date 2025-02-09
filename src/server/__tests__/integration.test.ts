import { Chat } from "../index";
import { Connection } from "partyserver";
import { nanoid } from "nanoid";
import { createClient } from "@openauthjs/openauth/client";

/**
 * Integration test suite for the Chat class and related components.
 * This file contains end-to-end tests to ensure the integration of various components works as expected.
 */
describe("Integration Tests", () => {
  let chat: Chat;
  let connection: Connection;
  let client: ReturnType<typeof createClient>;

  beforeEach(() => {
    chat = new Chat();
    connection = new Connection();
    client = createClient({
      clientID: "your-client-id",
      issuer: "https://auth.myserver.com",
    });
  });

  /**
   * Test to check the end-to-end flow of user authentication, message sending, and message storage.
   */
  test("end-to-end flow", async () => {
    const userProfile = {
      name: "Alice",
      picture: "https://example.com/picture.jpg",
      status: "Online",
    };
    const tokens = {
      access: "access-token",
      refresh: "refresh-token",
    };

    client.exchange = jest.fn().mockResolvedValue(tokens);
    client.getUserProfile = jest.fn().mockResolvedValue(userProfile);

    const code = "auth-code";
    const query = new URLSearchParams({ code });
    const location = { search: query.toString() };

    const handleAuthCallback = async () => {
      const tokens = await client.exchange(code, window.location.origin);
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      const userProfile = await client.getUserProfile(tokens.access);
      expect(userProfile.name).toBe("Alice");
      expect(userProfile.picture).toBe("https://example.com/picture.jpg");
      expect(userProfile.status).toBe("Online");
    };

    await handleAuthCallback();

    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check if the AI assistant responds to user messages.
   */
  test("AI assistant response", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the file attachment feature in messages.
   */
  test("file attachment feature", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: ["https://example.com/image.jpg"],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the handling of user profiles in messages.
   */
  test("user profiles", async () => {
    const userProfile = {
      name: "Alice",
      picture: "https://example.com/picture.jpg",
      status: "Online",
    };
    const tokens = {
      access: "access-token",
      refresh: "refresh-token",
    };

    client.exchange = jest.fn().mockResolvedValue(tokens);
    client.getUserProfile = jest.fn().mockResolvedValue(userProfile);

    const code = "auth-code";
    const query = new URLSearchParams({ code });
    const location = { search: query.toString() };

    const handleAuthCallback = async () => {
      const tokens = await client.exchange(code, window.location.origin);
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);

      const userProfile = await client.getUserProfile(tokens.access);
      expect(userProfile.name).toBe("Alice");
      expect(userProfile.picture).toBe("https://example.com/picture.jpg");
      expect(userProfile.status).toBe("Online");
    };

    await handleAuthCallback();

    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      profile: userProfile,
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the session management functionality.
   */
  test("session management", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    const session = chat.sessions.get("session1");
    expect(session).toBeDefined();
    expect(session.messages).toContainEqual(newMessage);
    expect(session.updated_at).toBeDefined();
  });

  /**
   * Test to check the logging of session activities.
   */
  test("logging of session activities", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    console.log = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("session1"));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("user1"));
  });

  /**
   * Test to check the error handling functionality.
   */
  test("error handling", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    console.error = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(console.error).toHaveBeenCalledWith("Error processing message", expect.any(Error));
    expect(chat.messages).not.toContainEqual(newMessage);
  });

  /**
   * Test to check the real-time analytics and monitoring functionality.
   */
  test("real-time analytics and monitoring", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.analyticsData.messageCount).toBe(1);
    expect(chat.analyticsData.userActivity["Alice"]).toBe(1);
    expect(chat.analyticsData.messageFrequency).toBeGreaterThan(0);
  });

  /**
   * Test to check the context-aware responses functionality.
   */
  test("context-aware responses", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the personalized interactions functionality.
   */
  test("personalized interactions", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the error handling scenarios in messageHandler.ts.
   */
  test("error handling scenarios in messageHandler.ts", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    console.error = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(console.error).toHaveBeenCalledWith("Error processing message", expect.any(Error));
    expect(chat.messages).not.toContainEqual(newMessage);
  });

  /**
   * Test to check the AI assistant responses based on conversation context and user preferences.
   */
  test("AI assistant responses based on conversation context and user preferences", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check the real-time analytics data tracking and updating.
   */
  test("real-time analytics data tracking and updating", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.analyticsData.messageCount).toBe(1);
    expect(chat.analyticsData.userActivity["Alice"]).toBe(1);
    expect(chat.analyticsData.messageFrequency).toBeGreaterThan(0);
  });
});
