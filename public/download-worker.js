importScripts(
  "https:unpkg.com/client-zip/worker.js",
  "https:unpkg.com/dl-stream/worker.js",
);

self.addEventListener("install", () => {
  // this ensure that updates to the underlying service worker take effect
  // immediately for both the current client and all other active clients
  self.skipWaiting();
});

self.addEventListener("activate", async (event) => {
  // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#activate
  // The first activation does not connect / intercept already running clients.
  // "claim" claims any already running clients.
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // This will intercept all request with a URL starting in /downloadZip/ ;
  // you should use a meaningful URL for each download, for example /downloadZip/invoices.zip
  const [, name] = url.pathname.match(/\/downloadZip\/(.+)/i) || [,];

  if (url.origin === self.origin && name) {
    // firefox will kill a worker even when it is streaming data out so we
    // ping it with an interval to allow large files to be downloaded
    if (name == "keep-alive") {
      event.respondWith(new Response("", { status: 200 }));
    } else {
      event.respondWith(
        event.request
          .formData()
          .then((data) => downloadZip(new DownloadStream(data.getAll("url"))))
          .catch((err) => new Response(err.message, { status: 500 })),
      );
    }
  }
});
