/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { ChainPatrolClient } from "@chainpatrol/sdk";
import { ImageResponse } from "@vercel/og";
import { farcasterHubContext } from "frames.js/middleware";

export const runtime = "edge";

const chainpatrol = new ChainPatrolClient({
  apiKey: process.env.CHAINPATROL_API_KEY!,
  baseUrl: "http://localhost:3000/api",
});

const regularFont = fetch(
  new URL("/public/assets/inter-latin-400-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
  new URL("/public/assets/inter-latin-700-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const DEFAULT_DEBUGGER_URL =
  process.env.DEBUGGER_URL ?? "http://localhost:3010/";

const DEFAULT_DEBUGGER_HUB_URL =
  process.env.NODE_ENV === "development"
    ? new URL("/hub", DEFAULT_DEBUGGER_URL).toString()
    : undefined;

const frames = createFrames({
  basePath: "/frames",
  middleware: [farcasterHubContext({ hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL })],
});

type ImageOptions = ConstructorParameters<typeof ImageResponse>[1];

const backButton = (
  <Button action="post" target={{ query: { op: "initial" } }}>
    ← Back to Home
  </Button>
);

const handleRequest = frames(async (ctx) => {
  const [regularFontData, boldFontData] = await Promise.all([
    regularFont,
    boldFont,
  ]);

  const imageOptions = {
    fonts: [
      {
        name: "Inter",
        data: regularFontData,
        weight: 400,
      },
      {
        name: "Inter",
        data: boldFontData,
        weight: 700,
      },
    ],
  } satisfies ImageOptions;

  const { op, content, error } = (() => {
    let op = ctx.searchParams.op;

    const content =
      ctx.searchParams.content ?? ctx.message?.inputText?.trim() ?? "";

    const error = (() => {
      if (!op || op === "initial") {
        return null;
      }

      if (content === "") {
        return "Empty URL";
      }

      try {
        new URL(content);
        return null;
      } catch (e) {
        if (e instanceof TypeError) {
          return "Invalid URL";
        } else {
          return "Unknown error";
        }
      }
    })();

    if (error) {
      op = "error";
    }

    return { op, content, error };
  })();

  switch (op) {
    case "check": {
      try {
        const result = await chainpatrol.asset.check({
          content,
        });

        return {
          imageOptions,
          image: (
            <div tw="flex flex-col items-center">
              {result.status === "ALLOWED" && (
                <div tw="flex">
                  <span tw="mr-2">✅ Allowed</span>
                </div>
              )}

              {result.status === "BLOCKED" && (
                <div tw="flex">
                  <span tw="mr-2">🚫 Blocked</span>
                </div>
              )}

              {(result.status === "UNKNOWN" || result.status === "IGNORED") && (
                <div tw="flex">
                  <span tw="mr-2">❓ Unknown</span>
                </div>
              )}

              <div tw="flex mt-2">
                <span tw="mr-2">🔗 URL: </span>
                <span tw="font-bold">{content}</span>
              </div>
            </div>
          ),
          buttons: [
            backButton,
            (result.status === "ALLOWED" || result.status === "BLOCKED") && (
              <Button
                action="link"
                target={`https://app.chainpatrol.io/search?content=${result.url}`}
              >
                Details
              </Button>
            ),
            result.status === "UNKNOWN" && (
              <Button
                action="post"
                target={{ query: { op: "report", content } }}
              >
                🥷 Report
              </Button>
            ),
          ],
        };
      } catch (e) {
        return {
          imageOptions,
          image: (
            <div tw="flex">
              <span tw="mr-2">❌ Error: </span>
              <span tw="font-bold">
                {e instanceof Error ? e.message : "Unknown error occurred"}
              </span>
            </div>
          ),
          buttons: [backButton],
        };
      }
    }

    case "report": {
      const result = await chainpatrol.report.create({
        organizationSlug: "chainpatrol",
        title: `Farcaster frame report: ${content}`,
        description: `This report was created from the ChainPatrol Farcaster frame. The user reported the following URL: ${content}`,
        externalReporter: ctx.message?.requesterUserData && {
          platform: "farcaster",
          platformIdentifier: ctx.message.requesterUserData.username,
          displayName: ctx.message.requesterUserData.displayName,
          avatarUrl: ctx.message.requesterUserData.profileImage,
        },
        assets: [
          {
            content,
            status: "BLOCKED",
          },
        ],
      });

      const reportUrl = `http://localhost:3000/reports/${result.id}`;

      return {
        imageOptions,
        image: (
          <div tw="flex">
            <span tw="mr-2">🥷 Reported</span>
            <span tw="font-bold">Thank you for your report!</span>
          </div>
        ),
        buttons: [
          backButton,
          <Button action="link" target={reportUrl}>
            View Report
          </Button>,
        ],
      };
    }

    case "error": {
      return {
        imageOptions,
        image: (
          <div tw="flex">
            <span tw="mr-2">❌ Error: </span>
            <span tw="font-bold">{error}</span>
          </div>
        ),
        buttons: [
          <Button action="post" target={{ query: { op: "" } }}>
            🔄 Retry
          </Button>,
        ],
      };
    }

    case "initial":
    default: {
      return {
        imageOptions,
        image: (
          <div tw="flex flex-col">
            <div tw="flex flex-col">
              <h1 tw="text-2xl font-bold leading-none mb-0">ChainPatrol</h1>
              <h2 tw="text-5xl font-bold leading-none mt-6">URL Checker</h2>
            </div>
            <div tw="flex">
              <p tw="mt-0">Enter a URL to check or report:</p>
            </div>
          </div>
        ),
        textInput: "Type a URL",
        buttons: [
          <Button action="post" target={{ query: { op: "check" } }}>
            🔎 Check
          </Button>,
          <Button action="post" target={{ query: { op: "report" } }}>
            🥷 Report
          </Button>,
        ],
      };
    }
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
