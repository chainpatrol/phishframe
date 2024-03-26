/* eslint-disable @next/next/no-img-element */

export function Layout({
  children,
  imageData,
}: {
  children: React.ReactNode;
  imageData: string;
}) {
  return (
    <div
      tw="h-screen w-screen relative flex flex-col text-white items-center justify-center"
      style={{ fontFamily: "'Fira Code', monospace" }}
    >
      <img
        src={imageData}
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
