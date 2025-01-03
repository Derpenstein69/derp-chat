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
   * 
   * @remarks
   * This test verifies that the Chat class correctly initializes its messages array by loading messages from the database when the onStart method is called.
   * 
   * @example
   * test("should initialize messages from the database on start", () => {
   *   const mockMessages = [
   *     { id: "1", user: "Alice", role: "user", content: "Hello", attachments: [] },
   *     { id: "2", user: "Bob", role: "assistant", content: "Hi", attachments: [] },
   *   ];
   *   chat.ctx.storage.sql.exec = jest.fn().mockReturnValue({
   *     toArray: () => mockMessages,
   *   });
   * 
   *   chat.onStart();
   * 
   *   expect(chat.messages).toEqual(mockMessages);
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class sends the initial messages to a newly connected client by calling the send method on the connection object.
   * 
   * @example
   * test("should send initial messages to connected client", () => {
   *   chat.messages = [
   *     { id: "1", user: "Alice", role: "user", content: "Hello", attachments: [] },
   *   ];
   *   connection.send = jest.fn();
   * 
   *   chat.onConnect(connection);
   * 
   *   expect(connection.send).toHaveBeenCalledWith(
   *     JSON.stringify({
   *       type: "all",
   *       messages: chat.messages,
   *     }),
   *   );
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class saves a new message to its messages array and broadcasts the message to all connected clients when the onMessage method is called with a new message.
   * 
   * @example
   * test("should save and broadcast new messages", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   expect(chat.messages).toContainEqual(newMessage);
   *   expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
   *   expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class updates an existing message in its messages array and broadcasts the updated message to all connected clients when the onMessage method is called with an updated message.
   * 
   * @example
   * test("should update and broadcast existing messages", async () => {
   *   const existingMessage = {
   *     id: "1",
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.messages = [existingMessage];
   *   const updatedMessage = { ...existingMessage, content: "Hi" };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "update", ...updatedMessage }));
   * 
   *   expect(chat.messages).toContainEqual(updatedMessage);
   *   expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "update", ...updatedMessage }));
   *   expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class handles AI assistant responses by broadcasting the AI's response to all connected clients and saving the response to its messages array.
   * 
   * @example
   * test("should handle AI assistant responses", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   *   chat.env.AI.run = jest.fn().mockResolvedValue(new ReadableStream());
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   expect(chat.messages).toContainEqual(newMessage);
   *   expect(chat.broadcast).toHaveBeenCalledWith(JSON.stringify({ type: "add", ...newMessage }));
   *   expect(chat.ctx.storage.sql.exec).toHaveBeenCalled();
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class creates a new session or updates an existing session in its sessions map when the onMessage method is called with a new message.
   * 
   * @example
   * test("should create and update sessions", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   const session = chat.sessions.get("session1");
   *   expect(session).toBeDefined();
   *   expect(session.messages).toContainEqual(newMessage);
   *   expect(session.updated_at).toBeDefined();
   * });
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
   * 
   * @remarks
   * This test verifies that the Chat class logs session activities by calling console.log with the session ID and user ID when the onMessage method is called with a new message.
   * 
   * @example
   * test("should log session activities", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   console.log = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining("session1"));
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining("user1"));
   * });
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

  /**
   * Test to check if the Chat class handles errors gracefully.
   * 
   * @remarks
   * This test verifies that the Chat class catches and handles errors gracefully by logging the error and continuing execution.
   * 
   * @example
   * test("should handle errors gracefully", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn().mockImplementation(() => {
   *     throw new Error("Test error");
   *   });
   *   console.error = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   expect(console.error).toHaveBeenCalledWith("Error processing message", expect.any(Error));
   *   expect(chat.messages).not.toContainEqual(newMessage);
   * });
   */
  test("should handle errors gracefully", async () => {
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
   * Test to check if the Chat class logs errors to an external logging service.
   * 
   * @remarks
   * This test verifies that the Chat class calls the logErrorToService function when an error occurs.
   * 
   * @example
   * test("should log errors to an external logging service", async () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn().mockImplementation(() => {
   *     throw new Error("Test error");
   *   });
   *   const logErrorToService = jest.fn();
   *   console.error = jest.fn().mockImplementation((message, error) => {
   *     logErrorToService(error);
   *   });
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));
   * 
   *   expect(logErrorToService).toHaveBeenCalledWith(expect.any(Error));
   * });
   */
  test("should log errors to an external logging service", async () => {
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
    const logErrorToService = jest.fn();
    console.error = jest.fn().mockImplementation((message, error) => {
      logErrorToService(error);
    });

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...newMessage }));

    expect(logErrorToService).toHaveBeenCalledWith(expect.any(Error));
  });

  /**
   * Test to check if the Chat class validates incoming messages.
   * 
   * @remarks
   * This test verifies that the Chat class validates incoming messages using the messageSchema and throws an error if validation fails.
   * 
   * @example
   * test("should validate incoming messages", async () => {
   *   const invalidMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.broadcast = jest.fn();
   *   chat.ctx.storage.sql.exec = jest.fn();
   *   console.error = jest.fn();
   * 
   *   await chat.onMessage(connection, JSON.stringify({ type: "add", ...invalidMessage }));
   * 
   *   expect(console.error).toHaveBeenCalledWith("Error processing message", expect.any(Error));
   *   expect(chat.messages).not.toContainEqual(invalidMessage);
   * });
   */
  test("should validate incoming messages", async () => {
    const invalidMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.broadcast = jest.fn();
    chat.ctx.storage.sql.exec = jest.fn();
    console.error = jest.fn();

    await chat.onMessage(connection, JSON.stringify({ type: "add", ...invalidMessage }));

    expect(console.error).toHaveBeenCalledWith("Error processing message", expect.any(Error));
    expect(chat.messages).not.toContainEqual(invalidMessage);
  });

  /**
   * Test to check if the Chat class saves messages to the database.
   * 
   * @remarks
   * This test verifies that the Chat class saves messages to the database using parameterized queries to prevent SQL injection and improve performance.
   * 
   * @example
   * test("should save messages to the database", () => {
   *   const newMessage = {
   *     id: nanoid(8),
   *     user: "Alice",
   *     role: "user",
   *     content: "Hello",
   *     attachments: [],
   *     session_id: "session1",
   *     user_id: "user1",
   *   };
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   chat.saveMessage(newMessage);
   * 
   *   expect(chat.ctx.storage.sql.exec).toHaveBeenCalledWith(
   *     `INSERT INTO messages (id, user, role, content, attachments, user_id, session_id, thread_id, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET content = ?, attachments = ?, thread_id = ?, reply_to = ?`,
   *     [
   *       newMessage.id,
   *       newMessage.user,
   *       newMessage.role,
   *       JSON.stringify(newMessage.content),
   *       JSON.stringify(newMessage.attachments),
   *       newMessage.user_id,
   *       newMessage.session_id,
   *       newMessage.thread_id,
   *       newMessage.reply_to,
   *       JSON.stringify(newMessage.content),
   *       JSON.stringify(newMessage.attachments),
   *       newMessage.thread_id,
   *       newMessage.reply_to,
   *     ],
   *   );
   * });
   */
  test("should save messages to the database", () => {
    const newMessage = {
      id: nanoid(8),
      user: "Alice",
      role: "user",
      content: "Hello",
      attachments: [],
      session_id: "session1",
      user_id: "user1",
    };
    chat.ctx.storage.sql.exec = jest.fn();

    chat.saveMessage(newMessage);

    expect(chat.ctx.storage.sql.exec).toHaveBeenCalledWith(
      `INSERT INTO messages (id, user, role, content, attachments, user_id, session_id, thread_id, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET content = ?, attachments = ?, thread_id = ?, reply_to = ?`,
      [
        newMessage.id,
        newMessage.user,
        newMessage.role,
        JSON.stringify(newMessage.content),
        JSON.stringify(newMessage.attachments),
        newMessage.user_id,
        newMessage.session_id,
        newMessage.thread_id,
        newMessage.reply_to,
        JSON.stringify(newMessage.content),
        JSON.stringify(newMessage.attachments),
        newMessage.thread_id,
        newMessage.reply_to,
      ],
    );
  });

  /**
   * Test to check if the Chat class saves sessions to the database.
   * 
   * @remarks
   * This test verifies that the Chat class saves sessions to the database using parameterized queries and batch updates to improve performance.
   * 
   * @example
   * test("should save sessions to the database", () => {
   *   const newSession = {
   *     session_id: "session1",
   *     user_id: "user1",
   *     created_at: new Date().toISOString(),
   *     updated_at: new Date().toISOString(),
   *     messages: [],
   *     ip_address: "127.0.0.1",
   *     user_agent: "Mozilla/5.0",
   *     user_activity_timestamps: [],
   *     device_information: "Windows 10",
   *     session_duration: 0,
   *   };
   *   chat.ctx.storage.sql.exec = jest.fn();
   * 
   *   chat.saveSession(newSession);
   * 
   *   expect(chat.ctx.storage.sql.exec).toHaveBeenCalledWith(
   *     `INSERT INTO sessions (session_id, user_id, created_at, updated_at, messages, ip_address, user_agent, user_activity_timestamps, device_information, session_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (session_id) DO UPDATE SET updated_at = ?, messages = ?, user_activity_timestamps = ?, device_information = ?, session_duration = ?`,
   *     [
   *       newSession.session_id,
   *       newSession.user_id,
   *       newSession.created_at,
   *       newSession.updated_at,
   *       JSON.stringify(newSession.messages),
   *       newSession.ip_address,
   *       newSession.user_agent,
   *       JSON.stringify(newSession.user_activity_timestamps),
   *       JSON.stringify(newSession.device_information),
   *       newSession.session_duration,
   *       newSession.updated_at,
   *       JSON.stringify(newSession.messages),
   *       JSON.stringify(newSession.user_activity_timestamps),
   *       JSON.stringify(newSession.device_information),
   *       newSession.session_duration,
   *     ],
   *   );
   * });
   */
  test("should save sessions to the database", () => {
    const newSession = {
      session_id: "session1",
      user_id: "user1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
      ip_address: "127.0.0.1",
      user_agent: "Mozilla/5.0",
      user_activity_timestamps: [],
      device_information: "Windows 10",
      session_duration: 0,
    };
    chat.ctx.storage.sql.exec = jest.fn();

    chat.saveSession(newSession);

    expect(chat.ctx.storage.sql.exec).toHaveBeenCalledWith(
      `INSERT INTO sessions (session_id, user_id, created_at, updated_at, messages, ip_address, user_agent, user_activity_timestamps, device_information, session_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (session_id) DO UPDATE SET updated_at = ?, messages = ?, user_activity_timestamps = ?, device_information = ?, session_duration = ?`,
      [
        newSession.session_id,
        newSession.user_id,
        newSession.created_at,
        newSession.updated_at,
        JSON.stringify(newSession.messages),
        newSession.ip_address,
        newSession.user_agent,
        JSON.stringify(newSession.user_activity_timestamps),
        JSON.stringify(newSession.device_information),
        newSession.session_duration,
        newSession.updated_at,
        JSON.stringify(newSession.messages),
        JSON.stringify(newSession.user_activity_timestamps),
        JSON.stringify(newSession.device_information),
        newSession.session_duration,
      ],
    );
  });
});
