/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const nextPageIndex = (pageIndex + 1) % totalPages;
  const prevPageIndex = (pageIndex - 1 + totalPages) % totalPages;

  const imageUrl = `https://picsum.photos/seed/frames.js-${pageIndex}/300/200`;

  return {
    image: (
      <div tw="flex flex-col">
        <img width={300} height={200} src={imageUrl} alt="Image" />
        <div tw="flex">
          This is slide {pageIndex + 1} / {totalPages}
        </div>
      </div>
    ),
    textInput: "Type something!",
    buttons: [
      <Button action="post" target={{ query: { pageIndex: prevPageIndex } }}>
        ←
      </Button>,
      <Button action="post" target={{ query: { pageIndex: nextPageIndex } }}>
        →
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
