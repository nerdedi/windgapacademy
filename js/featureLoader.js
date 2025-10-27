// Use dynamic imports for chunk optimization
window.showFeature = async function (feature) {
  const app = document.getElementById("feature-container") || document.getElementById("app");
  app.innerHTML = "";
  // Helper to safely invoke module
  async function invokeModule(mod, funcName) {
    if (mod && typeof mod[funcName] === "function") {
      mod[funcName](app);
    } else if (mod && typeof mod.default === "function") {
      mod.default(app);
    } else if (
      mod &&
      typeof mod.default === "object" &&
      typeof mod.default.constructor === "function"
    ) {
      new mod.default(app);
    } else {
      app.innerHTML = `<div class='alert-error'>Feature loaded but no display function found.</div>`;
      console.warn("Missing display function for feature:", mod, funcName);
    }
  }
  switch (feature) {
    // Games
    case "avatar": {
      const mod = await import("../components/AvatarBuilder.js");
      await invokeModule(mod, "showAvatarBuilder");
      break;
    }
    case "stairs": {
      const mod = await import("../components/ClimbingStairsAnimation.js");
      await invokeModule(mod, "showClimbingStairsAnimation");
      break;
    }
    case "island": {
      const mod = await import("../components/MaxAreaOfIslandAnimation.js");
      await invokeModule(mod, "showMaxAreaOfIslandAnimation");
      break;
    }
    case "cube": {
      const mod = await import("../components/CubeMapDemo.js");
      await invokeModule(mod, "showCubeMapDemo");
      break;
    }
    case "kitchen": {
      const mod = await import("../components/HealthyKitchenChallenge.js");
      await invokeModule(mod, "showHealthyKitchenChallenge");
      break;
    }
    case "foodcollector": {
      const mod = await import("../components/FoodCollectorEnv.js");
      await invokeModule(mod, "showFoodCollectorEnv");
      break;
    }
    case "zoo": {
      const mod = await import("../components/AcademyZoo.js");
      await invokeModule(mod, "showAcademyZoo");
      break;
    }
    // Tools
    case "fluid":
      // Use SPA route instead of a standalone static HTML page
      // Navigate to the React route that hosts the fluid simulation component
      window.history.pushState({}, "", "/tools/fluid-simulation");
      // Let React router handle rendering; provide fallback if not mounted
      if (window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("spa:navigate", { detail: { path: "/tools/fluid-simulation" } }),
        );
      }
      break;
    case "dashboard": {
      const mod = await import("../components/ResultsDashboard.js");
      await invokeModule(mod, "showResultsDashboard");
      break;
    }
    case "whiteboard":
      // Use SPA route instead of a standalone static HTML page
      window.history.pushState({}, "", "/tools/whiteboard");
      if (window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("spa:navigate", { detail: { path: "/tools/whiteboard" } }),
        );
      }
      break;
    case "ripple":
      // Redirect to ripple effect SPA route
      window.history.pushState({}, "", "/tools/ripple-effect");
      if (window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("spa:navigate", { detail: { path: "/tools/ripple-effect" } }),
        );
      }
      break;
    case "webgl":
      // Redirect to WebGL effects SPA route
      window.history.pushState({}, "", "/tools/webgl-effects");
      if (window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("spa:navigate", { detail: { path: "/tools/webgl-effects" } }),
        );
      }
      break;
    case "character":
      // Redirect to character animation SPA route
      window.history.pushState({}, "", "/tools/character-animation");
      if (window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("spa:navigate", { detail: { path: "/tools/character-animation" } }),
        );
      }
      break;
  }
};
// Show Windgap Academy branding splash or Avatar Creator by default
window.showFeature("avatar");
