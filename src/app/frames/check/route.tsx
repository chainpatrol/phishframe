/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import normalizeUrl from "normalize-url";
import { ErrorMessage } from "~/components/ErrorMessage";
import { Layout } from "~/components/Layout";
// import { Status } from "~/components/Status";
import { chainpatrol } from "~/lib/chainpatrol";
import { FontLoader } from "~/lib/font-loader";
import { createFrames } from "~/lib/frames";
import { ImageOptions } from "~/lib/types";
import { trimTrailingSlashes } from "~/lib/utils";

export const runtime = "edge";

const frames = createFrames();

const fontLoader = new FontLoader().preload();

const imagePromise = fetch(
  new URL("/public/images/frame-shell.png", import.meta.url)
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  });

const allowedImagePromise = fetch(
  new URL("/public/images/frame-check-allowed.png", import.meta.url)
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  });

const blockedImagePromise = fetch(
  new URL("/public/images/frame-check-blocked.png", import.meta.url)
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  });

const unknownImagePromise = fetch(
  new URL("/public/images/frame-check-unknown.png", import.meta.url)
)
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  });

const handleRequest = frames(async ({ searchParams, message }) => {
  // const [imageData, fontData] = await Promise.all([
  //   imagePromise,
  //   fontLoader.resolveFontData(),
  // ]);

  const [
    baseImageData,
    allowedImageData,
    blockedImageData,
    unknownImageData,
    fontData,
  ] = await Promise.all([
    imagePromise,
    allowedImagePromise,
    blockedImagePromise,
    unknownImagePromise,
    fontLoader.resolveFontData(),
  ]);

  const imageOptions = { fonts: fontData } as ImageOptions;

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

    const result = await chainpatrol.asset.check({
      content,
    });

    const imageData = (() => {
      if (result.status === "ALLOWED") {
        return allowedImageData;
      }

      if (result.status === "BLOCKED") {
        return blockedImageData;
      }

      return unknownImageData;
    })();

    return {
      imageOptions,
      image: <img src={imageData} alt="PhishFrame Check" tw="w-full h-full" />,
      // image: (
      //   <Layout imageData={imageData}>
      //     <div tw="flex flex-col h-full mt-8 text-2xl">
      //       <div tw="flex mt-2 mb-4">
      //         <span tw="mr-4">$ </span>
      //         <span tw="mr-3">phishframe check</span>
      //         <span tw="text-purple-300">$INPUT</span>
      //       </div>

      //       {result.status === "ALLOWED" && (
      //         <div tw="flex items-center">
      //           <span tw="mr-2">Status:</span>
      //           <Status status="ALLOWED" />
      //         </div>
      //       )}

      //       {result.status === "BLOCKED" && (
      //         <div tw="flex items-center">
      //           <span tw="mr-2">Status:</span>
      //           <Status status="BLOCKED" />
      //         </div>
      //       )}

      //       {(result.status === "UNKNOWN" || result.status === "IGNORED") && (
      //         <div tw="flex items-center">
      //           <span tw="mr-2">Status:</span>
      //           <Status status="UNKNOWN" />
      //         </div>
      //       )}
      //     </div>
      //   </Layout>
      // ),
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
          <Button
            action="post"
            target={{
              pathname: "/report",
              query: { content },
            }}
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
        <Layout imageData={baseImageData}>
          <ErrorMessage
            op="check"
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
