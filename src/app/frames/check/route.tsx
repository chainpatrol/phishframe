/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import normalizeUrl from "normalize-url";
import { ErrorMessage } from "~/components/ErrorMessage";
import { Layout } from "~/components/Layout";
import { Status } from "~/components/Status";
import { chainpatrol } from "~/lib/chainpatrol";
import { FontLoader } from "~/lib/font-loader";
import { frames } from "~/lib/frames";
import { ImageOptions } from "~/lib/types";
import { trimTrailingSlashes } from "~/lib/utils";

export const runtime = "edge";

const fontLoader = new FontLoader().preload();

const handleRequest = frames(async ({ searchParams, message }) => {
  console.log("handleRequest");
  const imageOptions = {
    fonts: await fontLoader.resolveFontData(),
  } as ImageOptions;

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
    console.error(error);
    return {
      imageOptions,
      image: <ErrorMessage op="check" error={error} />,
      buttons: [
        <Button action="post" target="/">
          ← Back to Home
        </Button>,
      ],
    };
  }

  try {
    const result = await chainpatrol.asset.check({
      content,
    });

    return {
      imageOptions,
      image: (
        <Layout>
          <div tw="flex flex-col h-full mt-8 text-2xl">
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

            {(result.status === "UNKNOWN" || result.status === "IGNORED") && (
              <div tw="flex items-center">
                <span tw="mr-2">Status:</span>
                <Status status="UNKNOWN" />
              </div>
            )}
          </div>
        </Layout>
      ),
      buttons: [
        <Button action="post" target="/">
          ← Back to Home
        </Button>,
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
          <Button action="post" target="/report">
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
          op="check"
          error={e instanceof Error ? e.message : "Unknown error occurred"}
        />
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
