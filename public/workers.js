// register the download service worker. this allows us to sequentially
// download each file and stream it into the client-zip library and present
// it as a web request, letting browsers to write it onto disk without needing
// to load it all into memory.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/download-worker.js")
    .then((_registration) => {
      // keep-alive for firefox
      setInterval(fetch, 25000, "downloadZip/keep-alive", { method: "POST" });
    });
}
