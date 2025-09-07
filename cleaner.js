const adKeys = [
  "adSlots",
  "playerAds",
  "adPlacements",
  "playbackTracking",
  "adBreakHeartbeatParams",
];


function cleanObj(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(cleanObj);

  const clone = { ...obj };
  for (const key of adKeys) {
    if (key in clone) delete clone[key];
  }

  for (const k in clone) {
    if (clone[k] && typeof clone[k] === "object") clone[k] = cleanObj(clone[k]);
  }

  return clone;
}


self.addEventListener("fetch", (event) => {
  const url = event.request.url;


  if (url.includes("youtube.com") || url.includes("ytimg.com")) {
    event.respondWith(
      fetch(event.request).then(async (res) => {
        const cloned = res.clone();

        try {
          let text = await cloned.text();

          if (text.trim().startsWith("{")) {
            let obj = JSON.parse(text);
            obj = cleanObj(obj);
            text = JSON.stringify(obj);
            return new Response(text, {
              status: res.status,
              statusText: res.statusText,
              headers: res.headers,
            });
          }
        } catch (e) {
        
          return res;
        }

        return res;
      })
    );
  }
});
