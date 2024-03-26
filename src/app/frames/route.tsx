/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { Layout } from "~/components/Layout";
import { FontLoader } from "~/lib/font-loader";
import { ImageOptions } from "~/lib/types";
import { frames } from "~/lib/frames";

export const runtime = "edge";

const fontLoader = new FontLoader().preload();

const handleRequest = frames(async (_ctx) => {
  const imageOptions = {
    fonts: await fontLoader.resolveFontData(),
  } as ImageOptions;

  return {
    imageOptions,
    image: (
      <Layout>
        <div tw="flex flex-col justify-center h-full text-2xl">
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

          <span tw="text-neutral-200 mt-4">Example: https://scam-site.com</span>
        </div>
      </Layout>
    ),
    textInput: "Type a URL",
    buttons: [
      <Button action="post" target="/check">
        🔎 Check
      </Button>,
      <Button action="post" target="/report">
        🥷 Report
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
