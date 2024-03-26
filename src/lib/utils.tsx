export function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}
