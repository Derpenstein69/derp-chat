import { Chat } from "../index";
import { Connection } from "partyserver";
import { nanoid } from "nanoid";

/**
 * Test suite for the Chat class.
 * This file contains unit tests for the Chat class and its methods.
 */
describe("Chat", () => {
  let chat: Chat;
  let connection: Connection;

  beforeEach(() => {
    chat = new Chat();
    connection = new Connection();
  });

  /**
   * Test to check if the Chat class initializes messages from the database on start.
   */
  test("should initialize messages from the database on start", () => {
    const mockMessages = [
      { id: "1", user: "Alice", role: "user", content: "Hello", attachments: [] },
      { id: "2", user: "Bob", role: "assistant", content: "Hi", attachments: [] },
    ];
    chat.ctx.storage.sql.exec = jest.fn().mockReturnValue({
      toArray: () => mockMessages,
    });

    chat.onStart();

    expect(chat.messages).toEqual(mockMessages);
  });

  /**
   * Test to check if the Chat class sends initial messages to connected client.
   */
  test("should send initial messages to connected client", () => {
    chat.messages = [
      { id: "1", user: "Alice", role: "user", content: "Hello", attachments: [] },
    ];
    connection.send = jest.fn();

    chat.onConnect(connection);

    expect(connection.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "all",
        messages: chat.messages,
      }),
    );
  });

  /**
   * Test to check if the Chat class saves and broadcasts new messages.
   */
  test("should save and broadcast new messages", async () => {
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
   * Test to check if the Chat class updates and broadcasts existing messages.
   */
  test("should update and broadcast existing messages", async () => {
    const existingMessage = {
      id: "1",
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.messages = [existingMessage];
    const updatedMessage = { ...existingMessage, content: "Hi" };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "update", ...updatedMessage }));

    expect(chat.messages).toContainEqual(updatedMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "update", ...updatedMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  /**
   * Test to check if the Chat class handles AI assistant responses.
   */
  test("should handle AI assistant responses", async () => {
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
   * Test to check if the Chat class creates and updates sessions.
   */
  test("should create and update sessions", async () => {
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
   * Test to check if the Chat class logs session activities.
   */
  test("should log session activities", async () => {
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
