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
      app.innerHTML =
        '<iframe src="/fluid-simulation.html" style="width:100%;height:600px;border:none;border-radius:12px;"></iframe>';
      break;
    case "dashboard": {
      const mod = await import("../components/ResultsDashboard.js");
      await invokeModule(mod, "showResultsDashboard");
      break;
    }
    case "whiteboard":
      app.innerHTML =
        '<iframe src="/whiteboard.html" style="width:100%;height:700px;border:none;border-radius:12px;"></iframe>';
      break;
  }
};
// Show Windgap Academy branding splash or Avatar Creator by default
window.showFeature("avatar");
