export function ErrorMessage({ op, error }: { op: string; error: string }) {
  return (
    <div tw="flex flex-col h-full mt-8 text-2xl">
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
  );
}
