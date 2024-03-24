/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { ChainPatrolClient } from "@chainpatrol/sdk";
import { ImageResponse } from "@vercel/og";
import { farcasterHubContext } from "frames.js/middleware";
import normalizeUrl from "normalize-url";

export const runtime = "edge";

const chainpatrol = new ChainPatrolClient({
  apiKey: process.env.CHAINPATROL_API_KEY!,
  baseUrl: process.env.CHAINPATROL_API_URL,
});

const regularFont = fetch(
  new URL("/public/assets/fonts/inter-latin-400-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const semiboldFont = fetch(
  new URL("/public/assets/fonts/inter-latin-600-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const boldFont = fetch(
  new URL("/public/assets/fonts/inter-latin-700-normal.ttf", import.meta.url)
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div tw="w-screen h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-8 pb-4">
      <div tw="flex flex-col bg-neutral-800 p-12 rounded-xl border border-white/30 shadow-lg w-full flex-1 relative">
        <div tw="flex items-center absolute top-0 left-0 right-0 px-4 py-3">
          {/* Mac stop lights */}
          <div tw="flex">
            <div tw="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <div tw="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <div tw="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>

          <div tw="flex-1 justify-center flex text-white/50 text-lg">
            <span>📁</span>
            <span tw="ml-2">ChainPatrol</span>
            <span tw="ml-2">•</span>
            <span tw="ml-2">Threat Detection Tools</span>
            <span tw="ml-2">•</span>
            <span tw="ml-2">Farcaster</span>
          </div>

          <div tw="flex">
            <span tw="text-white/50 text-lg">🔒</span>
          </div>
        </div>
        {children}
      </div>
      <div tw="flex items-center justify-between py-2 mt-4 w-full">
        <div tw="flex items-center justify-center">
          <img
            src="http://localhost:3001/assets/images/logo.svg"
            alt="ChainPatrol Logo"
            tw="w-12 h-12"
          />
          <span tw="font-semibold tracking-tighter text-white/90 text-3xl ml-3">
            ChainPatrol
          </span>
        </div>

        <span tw="text-white/50 text-[24px]">
          Follow us <span tw="text-white/70 ml-2">@chainpatrol</span>
        </span>
      </div>
    </div>
  );
}

const handleRequest = frames(async (ctx) => {
  const [regularFontData, semiboldFontData, boldFontData] = await Promise.all([
    regularFont,
    semiboldFont,
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
        data: semiboldFontData,
        weight: 600,
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
      ctx.searchParams.content ??
      (ctx.message?.inputText
        ? normalizeUrl(ctx.message?.inputText?.trim() ?? "")
        : "");

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
            <Shell>
              <div tw="flex flex-col items-center justify-center h-full">
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

                {(result.status === "UNKNOWN" ||
                  result.status === "IGNORED") && (
                  <div tw="flex">
                    <span tw="mr-2">❓ Unknown</span>
                  </div>
                )}

                <div tw="flex mt-2">
                  <span tw="mr-2">🔗 URL: </span>
                  <span tw="font-bold">{content}</span>
                </div>
              </div>
            </Shell>
          ),
          buttons: [
            backButton,
            (result.status === "ALLOWED" || result.status === "BLOCKED") && (
              <Button
                action="link"
                target={`${process.env.CHAINPATROL_APP_URL}/search?content=${result.url}`}
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
            <Shell>
              <div tw="flex justify-center items-center h-full">
                <span tw="mr-2">❌ Error: </span>
                <span tw="font-bold">
                  {e instanceof Error ? e.message : "Unknown error occurred"}
                </span>
              </div>
            </Shell>
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

      const reportUrl = `${process.env.CHAINPATROL_APP_URL}/reports/${result.id}`;

      return {
        imageOptions,
        image: (
          <Shell>
            <div tw="flex flex-col items-center justify-center h-full">
              <span tw="text-2xl mb-8 font-semibold tracking-wide uppercase bg-white/10 border border-white/30 px-6 py-2 rounded-full">
                ✅ Submission Complete
              </span>
              <span tw="font-bold mb-4 text-5xl text-center">
                Successfully created Report CH-{result.id}!
              </span>
              <span tw="text-neutral-200">Thank you for your support!</span>
            </div>
          </Shell>
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
          <Shell>
            <div tw="flex items-center justify-center h-full">
              <span tw="mr-2">❌ Error: </span>
              <span tw="font-bold">{error}</span>
            </div>
          </Shell>
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
          <Shell>
            <div tw="flex flex-col justify-center h-full">
              <h1 tw="text-5xl font-bold leading-none mt-6 mb-6 text-white">
                Threat Detection Tools
              </h1>
              <p tw="mt-0 text-neutral-400 text-3xl leading-relaxed">
                Use our tools to check if a URL is safe to visit or report a
                suspicious URL to our team to investigate.
              </p>

              <span tw="text-neutral-200 text-2xl mt-4">
                Example: https://scam-site.com
              </span>
            </div>
          </Shell>
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
