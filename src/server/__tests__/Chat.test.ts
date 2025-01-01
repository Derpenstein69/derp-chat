import { Chat } from "../index";
import { Connection } from "partyserver";
import { nanoid } from "nanoid";

describe("Chat", () => {
  let chat: Chat;
  let connection: Connection;

  beforeEach(() => {
    chat = new Chat();
    connection = new Connection();
  });

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

  test("should save and broadcast new messages", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });

  test("should update and broadcast existing messages", async () => {
    const existingMessage = {
      id: "1",
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
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

  test("should handle AI assistant responses", async () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(chat.messages).toContainEqual(newMessage);
    expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
    expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
  });
});
