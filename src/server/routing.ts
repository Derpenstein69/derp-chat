import { routePartykitRequest } from "partyserver";
import { Chat } from "./chatServer";
import { generateMessageSummary, generateSuggestions, analyzeConversationSentiment } from "./sessionManager";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.redirect(
        url.origin +
          `/authorize?client_id=your-client-id&redirect_uri=${encodeURIComponent(url.origin + "/callback")}&response_type=code`,
      );
    } else if (url.pathname === "/callback") {
      return Response.json({
        message: "OAuth flow complete!",
        params: Object.fromEntries(url.searchParams.entries()),
      });
    } else if (url.pathname === "/rate" && request.method === "POST") {
      const { userId, messageId, rating } = await request.json();
      const chat = new Chat();
      chat.saveRating(userId, messageId, rating);
      return new Response("Rating submitted successfully", { status: 200 });
    } else if (url.pathname === "/context-aware-summary" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const summary = generateMessageSummary(sessionId);
      return new Response(JSON.stringify({ summary }), { status: 200 });
    } else if (url.pathname === "/context-aware-suggestions" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const suggestions = generateSuggestions(sessionId);
      return new Response(JSON.stringify({ suggestions }), { status: 200 });
    } else if (url.pathname === "/context-aware-sentiment" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const sentiment = analyzeConversationSentiment(sessionId);
      return new Response(JSON.stringify({ sentiment }), { status: 200 });
    } else if (url.pathname === "/classify-image" && request.method === "POST") {
      const { imageUrl } = await request.json();
      const chat = new Chat();
      const classification = await chat.classifyImage(imageUrl);
      await chat.storeClassificationMetadata(imageUrl, classification);
      return new Response(JSON.stringify({ classification }), { status: 200 });
    } else if (url.pathname === "/seed-knowledge" && request.method === "POST") {
      const { documents } = await request.json();
      const chat = new Chat();
      await chat.seedKnowledge(documents);
      return new Response("Knowledge seeded successfully", { status: 200 });
    } else if (url.pathname === "/query-knowledge" && request.method === "GET") {
      const query = url.searchParams.get("query");
      if (!query) {
        return new Response("Query parameter is required", { status: 400 });
      }
      const chat = new Chat();
      const response = await chat.queryKnowledge(query);
      return new Response(JSON.stringify({ response }), { status: 200 });
    }

    return routePartykitRequest(request, env, ctx);
  },
};
