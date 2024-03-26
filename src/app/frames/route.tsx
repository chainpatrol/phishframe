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

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="96"
      height="96"
      fill="none"
      viewBox="0 0 96 96"
      {...props}
    >
      <path
        fill="#fff"
        d="M27.684 41.273l.63.34-.626.346-.345.637-.347-.632-.636-.346.63-.346.347-.631.347.632zM69.802 42.401l.966.525-.966.535-.525.967-.528-.962-.974-.529.968-.53.523-.971.536.965zM75.01 47.809l.49.259-.485.27-.264.483-.264-.483-.484-.26.478-.27.264-.483.265.484zM24.538 21.128l.484.264-.484.264-.26.49-.265-.484-.49-.266.484-.265.266-.483.265.48zM74.027 36.14l.484.26-.484.264-.264.489-.265-.484-.483-.264.483-.264.26-.484.27.484zM22.573 28.284l.968.525-.964.53-.529.972-.529-.967-.967-.525.962-.535.525-.967.534.967zM22.746 36.802l.632.342-.632.35-.342.632-.346-.632-.636-.341.632-.35.345-.633.347.632zM22.39 46.078l.635.345-.63.347-.347.636-.347-.63-.636-.347.632-.345.345-.638.347.632zM72.59 21.045l.638.347-.632.345-.345.637-.347-.631-.635-.347.63-.345.346-.638.345.632zM74.327 27.943l.632.347-.632.347-.342.63-.35-.63-.632-.341.632-.353.341-.63.35.63z"
      ></path>
      <path
        fill="#F9F9F9"
        d="M48.12 57.752l-1.416-.05v-6.35h1.416v6.4zM49.819 57.701l-1.42.05v-6.398h1.42V57.7z"
      ></path>
      <path
        fill="#fff"
        d="M63.931 46.21c-2.158-.336-5.998-.47-10.248-.484h-.041c-1.457-.006-2.963 0-4.476.02-.418 0-.825 0-1.247.01-.422 0-.83-.01-1.247-.01-1.511-.02-3.019-.026-4.475-.02h-.042c-4.25.015-8.089.148-10.248.483 0 0-16.756 4.236-15.233 14.322.285.85.703 1.858 1.288 3.018 2.891 5.708 10.06 15.025 27.803 26.438a3.912 3.912 0 002.154.632c.748 0 1.492-.205 2.154-.632 17.742-11.413 24.91-20.73 27.803-26.438.585-1.16 1.003-2.169 1.288-3.018 1.522-10.086-15.233-14.322-15.233-14.322z"
      ></path>
      <path
        fill="url(#paint0_radial_25_2)"
        d="M77.149 61.056c-.027.061-.051.127-.077.193a22.906 22.906 0 01-1.018 2.27c-2.72 5.275-9.454 13.894-26.127 24.458h-.009a3.747 3.747 0 01-1.44.54 3.663 3.663 0 01-1.725-.154 3.481 3.481 0 01-.834-.392C29.246 77.407 22.506 68.788 19.787 63.514a21.498 21.498 0 01-1.013-2.271c-.026-.077-.056-.148-.08-.214-1.894-9.317 14.02-13.44 14.02-13.44 2.063-.32 5.703-.448 9.75-.463 1.386 0 2.827 0 4.263.02.401 0 .799 0 1.207.01.402 0 .805-.01 1.202-.01 1.436-.02 2.882-.026 4.262-.02 4.048.015 7.693.143 9.75.463 0 0 15.95 4.135 14.016 13.467h-.015z"
      ></path>
      <path
        fill="#16073E"
        d="M49.875 50.629V88.24c-.454.291-.953.47-1.46.546V50.631h1.46v-.002zM48.124 50.629v38.188a3.764 3.764 0 01-1.46-.184V50.63h1.46z"
      ></path>
      <path
        fill="#fff"
        d="M49.875 49.402v6.92c-.47.035-.968.055-1.46.061v-6.98h1.46zM48.124 49.402v6.981c-.499 0-.992-.026-1.46-.062v-6.913h1.46v-.006z"
      ></path>
      <path
        fill="#16073E"
        d="M77.148 61.056c-.009.062-.026.127-.04.193H18.732c-.015-.071-.036-.148-.045-.214-1.894-9.317 14.021-13.44 14.021-13.44 2.063-.32 5.702-.448 9.75-.463 1.386 0 2.826 0 4.262.02.401 0 .799 0 1.207.01.404 0 .805-.01 1.202-.01 1.436-.02 2.882-.026 4.262-.02 4.048.015 7.693.142 9.75.463 0 0 15.95 4.134 14.016 13.466l-.01-.005z"
      ></path>
      <path
        fill="#F9F9F9"
        d="M47.844 59.055L46.43 59v-7.174h1.415v7.23zM49.545 58.999l-1.421.056v-7.23h1.421V59z"
      ></path>
      <path
        fill="#16073E"
        d="M21.407 65.368c-.066-.086-.137-.169-.205-.25z"
      ></path>
      <path
        stroke="#fff"
        strokeMiterlimit="10"
        strokeWidth="0.1"
        d="M38.696 34.556v-6.185l3.818 5.452-3.818.733z"
      ></path>
      <path
        fill="url(#paint1_linear_25_2)"
        d="M81.614 56.998V18.062c0-3.192-2.607-5.783-5.83-5.794L46.73 12.17l-26.83.098c-3.222.01-5.829 2.6-5.829 5.794v38.941S13.812 70.379 44.7 89.847a5.902 5.902 0 006.283 0C81.868 70.378 81.61 57.003 81.61 57.003l.004-.005zM49.78 85.13a3.617 3.617 0 01-3.87 0C18.754 67.97 18.983 56.143 18.983 56.143v-34.95c0-2.143 1.66-3.874 3.707-3.88l24.202-.091L73 17.313c2.051.01 3.71 1.742 3.71 3.88v34.944s.224 11.826-26.93 28.988v.005z"
      ></path>
      <path
        fill="#fff"
        d="M69.176 21.722V6.474a.99.99 0 00-.992-.992.99.99 0 00-.992.992v11.968C64.032 10.363 56.67 5.154 48.086 5.154c-9.54 0-17.569 6.435-19.997 16.097h-.009c-1.232 0-2.23.983-2.23 2.19v8.243c0 1.21.998 2.19 2.23 2.19h.098c.727 2.606 1.903 4.882 3.43 6.811 0 .128.01.255.016.383h-.036c0 5.402 0 11.953 16.5 11.953s16.5-6.551 16.5-11.953c.006-.133-.015-.259-.015-.392 1.476-1.864 2.627-4.052 3.355-6.547.065.005.127.02.193.02h.148c1.232 0 2.23-.982 2.23-2.19v-8.24a2.2 2.2 0 00-1.323-1.997z"
      ></path>
      <path
        fill="url(#paint2_radial_25_2)"
        d="M63.377 40.264c0 5.01.229 11.088-15.303 11.088-15.533 0-15.304-6.078-15.304-11.088"
      ></path>
      <path
        fill="url(#paint3_linear_25_2)"
        d="M63.377 38.263c0 5.01.229 11.089-15.303 11.089-15.533 0-15.304-6.079-15.304-11.089"
      ></path>
      <path
        fill="url(#paint4_radial_25_2)"
        d="M67.357 27.649c0 12.075-8.625 19.1-19.254 19.1-10.63 0-19.254-7.025-19.254-19.1 0-12.075 7.946-20.008 17.992-20.659.418-.026.84-.041 1.262-.041h.199c.097 0 .193.005.29.005.49.015.977.045 1.461.098 9.714.975 17.304 9.264 17.304 20.597z"
      ></path>
      <path
        fill="#16073E"
        d="M48.37 46.75c11.216 0 18.637-6.471 18.637-17.035S59.4 23.58 48.185 23.58c-11.214 0-18.984-5.07-18.984 5.494 0 10.563 7.952 17.675 19.168 17.675z"
      ></path>
      <path
        fill="url(#paint5_linear_25_2)"
        d="M48.333 44.184c9.597 0 15.945-5.045 15.945-13.276 0-8.232-6.506-4.786-16.102-4.786s-16.24-3.95-16.24 4.281 6.8 13.781 16.397 13.781z"
      ></path>
      <path
        fill="#16073E"
        d="M48.073 6.949h.2V24.73H46.81V6.988l1.262-.04zM50.023 7.05v17.681h-1.46V6.953c.487.017.976.047 1.46.097z"
      ></path>
      <path
        fill="url(#paint6_radial_25_2)"
        d="M37.943 58.489h20.252c.978 0 1.772.793 1.772 1.772v11.255c0 .979-.794 1.772-1.772 1.772H37.943a1.772 1.772 0 01-1.772-1.772V60.261c0-.98.793-1.772 1.772-1.772z"
      ></path>
      <path
        fill="#16073E"
        d="M42.326 64.96a1.853 1.853 0 100-3.706 1.853 1.853 0 000 3.705z"
      ></path>
      <path
        fill="url(#paint7_radial_25_2)"
        d="M43.206 61.463l.01-.01s-.036-.026-.108-.071a1.359 1.359 0 00-.24-.157c-2.428-1.645-16.9-10.253-9.871-17.162l-.2-4.064s-15.567 8.421 8.03 24.422l.009-.009a1.9 1.9 0 003.004-1.543c0-.56-.244-1.054-.632-1.404h-.002v-.002z"
      ></path>
      <path
        fill="#16073E"
        d="M51.703 61.438h-1.849v9.133h1.85v-9.133zM54.443 61.438h-1.85v9.133h1.85v-9.133zM57.263 61.438h-1.849v9.133h1.849v-9.133z"
      ></path>
      <defs>
        <radialGradient
          id="paint0_radial_25_2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(47.923 67.84) scale(25.4269)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="0.39" stopColor="#EDEDED"></stop>
          <stop offset="1" stopColor="#CCC"></stop>
        </radialGradient>
        <linearGradient
          id="paint1_linear_25_2"
          x1="47.842"
          x2="47.842"
          y1="12.171"
          y2="90.75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6022DC"></stop>
          <stop offset="1" stopColor="#DC22D1"></stop>
        </linearGradient>
        <radialGradient
          id="paint2_radial_25_2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(48.074 45.808) scale(11.5096)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="0.15" stopColor="#F9F9F9"></stop>
          <stop offset="0.34" stopColor="#E8E8E8"></stop>
          <stop offset="0.56" stopColor="#CCC"></stop>
          <stop offset="0.8" stopColor="#A5A5A5"></stop>
          <stop offset="1" stopColor="gray"></stop>
        </radialGradient>
        <linearGradient
          id="paint3_linear_25_2"
          x1="48.074"
          x2="48.074"
          y1="38.263"
          y2="49.351"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1F1F1F"></stop>
          <stop offset="0.09" stopColor="#282828"></stop>
          <stop offset="0.25" stopColor="#424242"></stop>
          <stop offset="0.45" stopColor="#6C6C6C"></stop>
          <stop offset="0.69" stopColor="#A7A7A7"></stop>
          <stop offset="0.95" stopColor="#F0F0F0"></stop>
          <stop offset="1" stopColor="#fff"></stop>
        </linearGradient>
        <radialGradient
          id="paint4_radial_25_2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(48.104 26.849) scale(19.5801)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="0.42" stopColor="#FDFDFD"></stop>
          <stop offset="0.57" stopColor="#F6F6F6"></stop>
          <stop offset="0.68" stopColor="#EAEAEA"></stop>
          <stop offset="0.77" stopColor="#D9D9D9"></stop>
          <stop offset="0.84" stopColor="#C3C3C3"></stop>
          <stop offset="0.91" stopColor="#A8A8A8"></stop>
          <stop offset="0.97" stopColor="#888"></stop>
          <stop offset="1" stopColor="#737373"></stop>
        </radialGradient>
        <linearGradient
          id="paint5_linear_25_2"
          x1="31.934"
          x2="64.278"
          y1="34.679"
          y2="34.679"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6022DC"></stop>
          <stop offset="1" stopColor="#DC22D1"></stop>
        </linearGradient>
        <radialGradient
          id="paint6_radial_25_2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(9.14181 0 0 12.9686 46.423 65.255)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="0.36" stopColor="#EDEEEE"></stop>
          <stop offset="0.89" stopColor="#CED0D1"></stop>
          <stop offset="1" stopColor="#CCC"></stop>
        </radialGradient>
        <radialGradient
          id="paint7_radial_25_2"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(35.803 52.383) scale(10.4405)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff"></stop>
          <stop offset="0.39" stopColor="#EDEDED"></stop>
          <stop offset="1" stopColor="#CCC"></stop>
        </radialGradient>
      </defs>
    </svg>
  );
}

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
          <Logo style={{ width: "50px", height: "50px" }} />
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
