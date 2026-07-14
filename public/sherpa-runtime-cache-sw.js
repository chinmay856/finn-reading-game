const CACHE_PREFIX = "finn-sherpa-runtime-";
const CLEANUP_READY_MESSAGE = "finn-sherpa-opfs-cleanup-ready";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith(CACHE_PREFIX))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== CLEANUP_READY_MESSAGE) return;
  const reply = event.ports?.[0];
  event.waitUntil(self.clients.claim().then(() => {
    reply?.postMessage({ type: CLEANUP_READY_MESSAGE });
  }));
});
