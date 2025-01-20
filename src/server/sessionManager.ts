/**
 * @file sessionManager.ts
 * @description Manages session-related functionalities including generating message summaries, suggestions, and sentiment analysis.
 * @module Server
 */

import { SentimentAnalyzer, PorterStemmer } from "natural";
import type { ChatMessage, Session } from "../shared";
import { Chat } from "./chatServer";

/**
 * Generates a context-aware message summary for a given session.
 * 
 * @param {string} sessionId - The ID of the session.
 * @returns {string} The summary of the conversation history.
 * 
 * @example
 * const summary = generateMessageSummary("session1");
 * console.log(summary);
 */
export function generateMessageSummary(sessionId: string): string {
  const session = Chat.prototype.sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
  return `Summary: ${messages}`;
}

/**
 * Provides context-aware suggestions based on the conversation history and user preferences.
 * 
 * @param {string} sessionId - The ID of the session.
 * @returns {string[]} The list of suggestions.
 * 
 * @example
 * const suggestions = generateSuggestions("session1");
 * console.log(suggestions);
 */
export function generateSuggestions(sessionId: string): string[] {
  const session = Chat.prototype.sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
  return [`Suggestion 1 based on: ${messages}`, `Suggestion 2 based on: ${messages}`];
}

/**
 * Analyzes the sentiment of the conversation history to adjust the tone and style of the AI assistant's responses.
 * 
 * @param {string} sessionId - The ID of the session.
 * @returns {string} The sentiment analysis result.
 * 
 * @example
 * const sentiment = analyzeConversationSentiment("session1");
 * console.log(sentiment);
 */
export function analyzeConversationSentiment(sessionId: string): string {
  const session = Chat.prototype.sessions.get(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }
  const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
  const sentimentAnalyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  const sentiment = sentimentAnalyzer.getSentiment(messages.split(" "));
  return sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral";
}
