/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import { ChainPatrolClient } from "@chainpatrol/sdk";
import type { ImageResponse } from "@vercel/og";
import normalizeUrl from "normalize-url";

export const runtime = "edge";

const chainpatrol = new ChainPatrolClient({
  apiKey: process.env.CHAINPATROL_API_KEY!,
  baseUrl: process.env.CHAINPATROL_API_URL,
});

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

function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

type ImageOptions = ConstructorParameters<typeof ImageResponse>[1];

const backButton = (
  <Button action="post" target={{ query: { op: "initial" } }}>
    ← Back to Home
  </Button>
);

function Layout({ children }: { children: React.ReactNode }) {
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
            <span tw="ml-2">Farcaster</span>
            <span tw="ml-2">•</span>
            <span tw="ml-2">ChainPatrol</span>
            <span tw="ml-2">•</span>
            <span tw="ml-2">PhishFrame</span>
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
            src={`${
              (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
              (process.env.RAILWAY_PUBLIC_DOMAIN &&
                `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`) ??
              "http://localhost:3001"
            }/images/logo.svg`}
            alt="ChainPatrol Logo"
            tw="w-12 h-12"
          />
          <span tw="font-bold tracking-tighter text-white/90 text-3xl ml-3">
            ChainPatrol
          </span>
        </div>

        <span tw="text-white/50 text-[24px]">
          Follow us <span tw="text-white/70 ml-2 font-bold">@chainpatrol</span>
        </span>
      </div>
    </div>
  );
}

function ErrorMessage({ op, error }: { op: string; error: string }) {
  return (
    <Layout>
      <div
        tw="flex flex-col h-full mt-8 text-2xl"
        style={{ fontFamily: "'Fira Code', monospace" }}
      >
        <div tw="flex mt-2 mb-4">
          <span tw="mr-4">$ </span>
          <span tw="mr-3">phishframe {op}</span>
          <span tw="text-purple-300">$INPUT</span>
        </div>

        <div tw="flex text-neutral-400">
          <span tw="mr-2">Error:</span>
          <span tw="text-red-300">&quot;{error}&quot;</span>
        </div>
      </div>
    </Layout>
  );
}

function Status({
  status,
  label,
}: {
  status: "ALLOWED" | "BLOCKED" | "UNKNOWN" | "IGNORED";
  label?: string;
}) {
  const color = (() => {
    switch (status) {
      case "ALLOWED":
        return "green";
      case "BLOCKED":
        return "red";
      case "UNKNOWN":
      case "IGNORED":
        return "neutral";
      default:
        return "neutral";
    }
  })();

  return (
    <span
      tw={`bg-${color}-300 text-neutral-800 px-2 py-0.5 text-2xl leading-none font-bold uppercase`}
    >
      {label ?? status}
    </span>
  );
}

const interRegularFont = fetch(
  new URL("/public/fonts/inter-latin-400-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const interBoldFont = fetch(
  new URL("/public/fonts/inter-latin-700-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const firaCodeRegularFont = fetch(
  new URL("/public/fonts/fira-code-latin-400-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const firaCodeBoldFont = fetch(
  new URL("/public/fonts/fira-code-latin-700-normal.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const handleRequest = frames(async (ctx) => {
  const [
    interRegularFontData,
    interBoldFontData,
    firaCodeRegularFontData,
    firaCodeBoldFontData,
  ] = await Promise.all([
    interRegularFont,
    interBoldFont,
    firaCodeRegularFont,
    firaCodeBoldFont,
  ]);

  const imageOptions = {
    fonts: [
      {
        name: "Inter",
        data: interRegularFontData,
        weight: 400,
      },
      {
        name: "Inter",
        data: interBoldFontData,
        weight: 700,
      },
      {
        name: "Fira Code",
        data: firaCodeRegularFontData,
        weight: 400,
      },
      {
        name: "Fira Code",
        data: firaCodeBoldFontData,
        weight: 700,
      },
    ],
  } satisfies ImageOptions;

  const { op, content, error } = (() => {
    let op = ctx.searchParams.op;

    const content = (() => {
      try {
        const url = new URL(
          ctx.searchParams.content ??
            (ctx.message?.inputText
              ? normalizeUrl(ctx.message?.inputText?.trim()) ?? ""
              : "")
        );

        return url.toString();
      } catch (e) {
        return null;
      }
    })();

    const error = (() => {
      if (!op || op === "initial") {
        return null;
      }

      if (content === null) {
        return "Invalid URL";
      }

      if (content === "") {
        return "Empty URL";
      }
    })();

    return { op, content, error };
  })();

  if (error) {
    console.error(error);
    return {
      imageOptions,
      image: <ErrorMessage op={op} error={error} />,
      buttons: [backButton],
    };
  }

  switch (op) {
    case "check": {
      try {
        const result = await chainpatrol.asset.check({
          content,
        });

        return {
          imageOptions,
          image: (
            <Layout>
              <div
                tw="flex flex-col h-full mt-8 text-2xl"
                style={{ fontFamily: "'Fira Code', monospace" }}
              >
                <div tw="flex mt-2 mb-4">
                  <span tw="mr-4">$ </span>
                  <span tw="mr-3">phishframe check</span>
                  <span tw="text-purple-300">$INPUT</span>
                </div>

                <div tw="flex mt-2">
                  <span tw="mr-2">URL: </span>
                  <span tw="font-bold">{content}</span>
                </div>

                {result.status === "ALLOWED" && (
                  <div tw="flex items-center">
                    <span tw="mr-2">Status:</span>
                    <Status status="ALLOWED" />
                  </div>
                )}

                {result.status === "BLOCKED" && (
                  <div tw="flex items-center">
                    <span tw="mr-2">Status:</span>
                    <Status status="BLOCKED" />
                  </div>
                )}

                {(result.status === "UNKNOWN" ||
                  result.status === "IGNORED") && (
                  <div tw="flex items-center">
                    <span tw="mr-2">Status:</span>
                    <Status status="UNKNOWN" />
                  </div>
                )}
              </div>
            </Layout>
          ),
          buttons: [
            backButton,
            (result.status === "ALLOWED" || result.status === "BLOCKED") && (
              <Button
                action="link"
                target={`${trimTrailingSlashes(
                  process.env.CHAINPATROL_APP_URL!
                )}/search?content=${content}`}
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
        console.error(e);
        return {
          imageOptions,
          image: (
            <ErrorMessage
              op={op}
              error={e instanceof Error ? e.message : "Unknown error occurred"}
            />
          ),
          buttons: [backButton],
        };
      }
    }

    case "report": {
      const title = `Farcaster frame report: ${content}`;
      const description = `This report was created from the ChainPatrol Farcaster frame. The user reported the following URL: ${content}`;
      const assets = [
        {
          content,
          status: "BLOCKED",
        },
      ];
      const reporter = ctx.message?.requesterUserData && {
        platform: "farcaster",
        platformIdentifier: ctx.message.requesterUserData.username,
        displayName: ctx.message.requesterUserData.displayName,
        avatarUrl: ctx.message.requesterUserData.profileImage,
      };

      const result = await chainpatrol.report.create({
        organizationSlug: "phishframe",
        title,
        description,
        externalReporter: reporter,
        assets,
      });

      const reportUrl = `${trimTrailingSlashes(
        process.env.CHAINPATROL_APP_URL!
      )}/reports/${result.id}`;

      return {
        imageOptions,
        image: (
          <Layout>
            <div
              tw="flex flex-col h-full mt-8 text-2xl"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              <div tw="flex mt-2 mb-4">
                <span tw="mr-4">$ </span>
                <span tw="mr-3">phishframe report</span>
                <span tw="text-purple-300">$INPUT</span>
              </div>

              <span tw="font-bold mb-8">
                ✅ Successfully created report CH-{result.id}!
              </span>

              <div tw="flex text-neutral-400">
                <span tw="mr-2">Title:</span>
                <span tw="text-lime-200">&quot;{title}&quot;</span>
              </div>
              {reporter && (
                <div tw="flex text-neutral-400">
                  <span tw="mr-2">Reporter:</span>
                  <span tw="text-lime-200">
                    &quot;{reporter.displayName} (@{reporter.platformIdentifier}
                    )&quot;
                  </span>
                </div>
              )}
              <div tw="flex flex-col text-neutral-400 mb-8 mt-8">
                <span>
                  {assets.map((a) => (
                    <>
                      {a.status === "ALLOWED" && (
                        <Status status="ALLOWED" label="Allow" />
                      )}
                      {a.status === "BLOCKED" && (
                        <Status status="BLOCKED" label="Block" />
                      )}
                      <span tw="ml-3">{a.content}</span>
                    </>
                  ))}
                </span>
              </div>

              <div tw="flex text-neutral-400">
                <span tw="mr-4">Report URL:</span>
                <span tw="text-blue-300 underline">{reportUrl}</span>
              </div>
            </div>
          </Layout>
        ),
        buttons: [
          backButton,
          <Button action="link" target={reportUrl}>
            View Report
          </Button>,
        ],
      };
    }

    case "initial":
    default: {
      return {
        imageOptions,
        image: (
          <Layout>
            <div
              tw="flex flex-col justify-center h-full text-2xl"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              <div tw="flex mt-2 mb-4">
                <span tw="mr-4">$ </span>
                <span tw="mr-3">phishframe --help</span>
              </div>

              <h1 tw="font-bold text-2xl leading-none mt-6 mb-6 text-white">
                PhishFrame
              </h1>
              <p tw="mt-0 text-neutral-400 text-2xl leading-relaxed">
                Type a valid URL below and click &quot;Check&quot; to see if
                it&apos;s safe or &quot;Report&quot; to report a phishing site.
              </p>

              <span tw="text-neutral-200 mt-4">
                Example: https://scam-site.com
              </span>
            </div>
          </Layout>
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
