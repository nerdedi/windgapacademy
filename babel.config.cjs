module.exports = function (api) {
  api && api.cache && api.cache(true);
  const presets = ["@babel/preset-env"];
  try {
    // Only include preset-react when it's actually installed in this environment.
    // This avoids failing local test runs in restricted environments.
    require.resolve("@babel/preset-react");
    presets.push("@babel/preset-react");
  } catch (e) {
    // preset not available; continue without it.
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") {
      console.info("@babel/preset-react not found; JSX transform disabled locally.");
    }
  }

  return { presets };
};
