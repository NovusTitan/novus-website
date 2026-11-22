// Cached at build time; refreshes on each deploy.
export async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
