import audiobookshelfProxyHandler from "./proxy";

/**
 * Build an API URL for the widget.
 * Returns null if inputs are invalid.
 */
function buildApi(url, endpoint) {
  if (!url || typeof url !== "string") return null;
  if (!endpoint || typeof endpoint !== "string") return null;
  // strip trailing slash from url
  const base = url.replace(/\/$$/, "");
  return `${base}/api/${endpoint}`;
}

const widget = {
  api: buildApi,
  proxyHandler: audiobookshelfProxyHandler,
  mappings: {
    libraries: {
      endpoint: "libraries",
    },
  },
};

export default widget;
