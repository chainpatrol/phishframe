/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import normalizeUrl from "normalize-url";
import { ErrorMessage } from "~/components/ErrorMessage";
import { Layout } from "~/components/Layout";
import { Status } from "~/components/Status";
import { chainpatrol } from "~/lib/chainpatrol";
import { FontLoader } from "~/lib/font-loader";
import { createFrames } from "~/lib/frames";
import { ImageOptions } from "~/lib/types";
import { trimTrailingSlashes } from "~/lib/utils";

export const runtime = "edge";

const fontLoader = new FontLoader().preload();

const imagePromise = fetch(
  new URL("/public/images/frame-shell.png", import.meta.url)
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  });

const frames = createFrames({ includeHubsMiddleware: true });

const handleRequest = frames(async ({ searchParams, message }) => {
  try {
    const content = (() => {
      try {
        const url = new URL(
          searchParams.content ??
            (message?.inputText
              ? normalizeUrl(message?.inputText?.trim()) ?? ""
              : "")
        );

        return url.toString();
      } catch (e) {
        return null;
      }
    })();

    const error = (() => {
      if (content === null) {
        return "Invalid URL";
      }

      if (content === "") {
        return "Empty URL";
      }
    })();

    if (error) {
      throw new Error(error);
    }

    const title = `Farcaster frame report: ${content}`;
    const description = `This report was created from the ChainPatrol Farcaster frame. The user reported the following URL: ${content}`;
    const assets = [
      {
        content,
        status: "BLOCKED",
      },
    ];
    const reporter = message?.requesterUserData && {
      platform: "farcaster",
      platformIdentifier: message.requesterUserData.username,
      displayName: message.requesterUserData.displayName,
      avatarUrl: message.requesterUserData.profileImage,
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

    const [imageData, fontData] = await Promise.all([
      imagePromise,
      fontLoader.resolveFontData(),
    ]);

    const imageOptions = { fonts: fontData } as ImageOptions;

    return {
      imageOptions,
      image: (
        <Layout imageData={imageData}>
          <div tw="flex flex-col h-full mt-8 text-2xl">
            <div tw="flex mt-2 mb-4">
              <span tw="mr-4">$ </span>
              <span tw="mr-3">phishframe report</span>
              <span tw="text-purple-300">$INPUT</span>
            </div>

            <span tw="font-bold mb-8">✅ Successfully created report!</span>

            <div tw="flex text-neutral-400">
              <span tw="mr-2">
                Click &apos;View Report&apos; below to see details
              </span>
            </div>
          </div>
        </Layout>
      ),
      buttons: [
        <Button action="post" target="/">
          ← Back to Home
        </Button>,
        ,
        <Button action="link" target={reportUrl}>
          View Report
        </Button>,
      ],
    };
  } catch (e) {
    console.error(e);

    const [imageData, fontData] = await Promise.all([
      imagePromise,
      fontLoader.resolveFontData(),
    ]);

    const imageOptions = { fonts: fontData } as ImageOptions;

    return {
      imageOptions,
      image: (
        <Layout imageData={imageData}>
          <ErrorMessage
            op="report"
            error={e instanceof Error ? e.message : "Unknown error occurred"}
          />
        </Layout>
      ),
      buttons: [
        <Button action="post" target="/">
          ← Back to Home
        </Button>,
      ],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
