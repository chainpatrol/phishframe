import { ChainPatrolClient } from "@chainpatrol/sdk";

export const chainpatrol = new ChainPatrolClient({
  apiKey: process.env.CHAINPATROL_API_KEY!,
  baseUrl: process.env.CHAINPATROL_API_URL,
});
