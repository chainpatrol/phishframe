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
  const imageOptions = {
    fonts: await fontLoader.resolveFontData(),
  } as ImageOptions;

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

    return {
      imageOptions,
      image: (
        <Layout>
          <div tw="flex flex-col h-full mt-8 text-2xl">
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
    return {
      imageOptions,
      image: (
        <ErrorMessage
          op="report"
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
