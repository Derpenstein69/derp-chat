import { usePartySocket as originalUsePartySocket } from "partysocket/react";

export function usePartySocket(options) {
  return originalUsePartySocket(options);
}
