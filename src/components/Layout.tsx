/* eslint-disable @next/next/no-img-element */

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      tw="h-screen w-screen relative flex flex-col text-white items-center justify-center"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      <img
        src={`${
          (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
          (process.env.RAILWAY_PUBLIC_DOMAIN &&
            `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`) ??
          "http://localhost:3001"
        }/images/frame-shell.png`}
        alt="Frame shell"
        tw="absolute top-0 left-0 right-0 bottom-0 w-full"
      />
      <div tw="flex w-screen h-screen px-8 py-24">
        <div tw="flex flex-col w-full flex-1 relative px-8 py-2">
          {children}
        </div>
      </div>
    </div>
  );
}
