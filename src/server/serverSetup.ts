import { Server } from "partyserver";
import { Chat } from "./chatServer";

export default {
  async fetch(request, env, ctx) {
    const chat = new Chat();
    await chat.onStart();
    return Server.fetch(request, env, ctx);
  },
};
