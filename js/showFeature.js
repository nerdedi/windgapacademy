// Feature routing logic
export async function showFeature(feature) {
  // ...existing code for featureMap and routing...
  // This function should be filled in with the logic from app.js
}

// Attach to window for inline HTML usage
if (typeof window !== "undefined") {
  window.showFeature = showFeature;
}
