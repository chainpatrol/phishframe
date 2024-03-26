import { farcasterHubContext } from "frames.js/middleware";
import { createFrames as _createFrames } from "frames.js/next";
import { DEFAULT_DEBUGGER_HUB_URL } from "~/lib/constants";

export function createFrames({ includeHubsMiddleware = false } = {}) {
  return _createFrames({
    basePath: "/frames",
    middleware: includeHubsMiddleware
      ? [farcasterHubContext({ hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL })]
      : [],
  });
}
