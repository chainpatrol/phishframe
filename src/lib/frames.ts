import { farcasterHubContext } from "frames.js/middleware";
import { createFrames } from "frames.js/next";
import { DEFAULT_DEBUGGER_HUB_URL } from "~/lib/constants";

export const frames = createFrames({
  basePath: "/frames",
  middleware: [farcasterHubContext({ hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL })],
});
