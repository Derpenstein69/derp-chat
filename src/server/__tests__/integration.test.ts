import { Chat } from "../index";
import { Connection } from "partyserver";
import { nanoid } from "nanoid";
import { createClient } from "@openauthjs/openauth/client";

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
});
