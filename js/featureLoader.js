// Use dynamic imports for chunk optimization
window.showFeature = async function(feature) {
  const container = document.getElementById('feature-container');
  container.innerHTML = '';
  switch(feature) {
    // Games
    case 'avatar': {
      const mod = await import('../components/AvatarBuilder.js');
      new mod.default(container);
      break;
    }
    case 'stairs': {
      const mod = await import('../components/ClimbingStairsAnimation.js');
      new mod.ClimbingStairsAnimation(container);
      break;
    }
    case 'island': {
      const mod = await import('../components/MaxAreaOfIslandAnimation.js');
      new mod.MaxAreaOfIslandAnimation(container);
      break;
    }
    case 'cube': {
      const mod = await import('../components/CubeMapDemo.js');
      new mod.CubeMapDemo(container);
      break;
    }
    case 'kitchen': {
      const mod = await import('../components/HealthyKitchenChallenge.js');
      new mod.HealthyKitchenChallenge(container);
      break;
    }
    case 'foodcollector': {
      const mod = await import('../components/FoodCollectorEnv.js');
      new mod.FoodCollectorEnv(container);
      break;
    }
    case 'zoo': {
      const mod = await import('../components/AcademyZoo.js');
      new mod.default(container);
      break;
    }
    // Tools
    case 'fluid':
      container.innerHTML = '<iframe src="/fluid-simulation.html" style="width:100%;height:600px;border:none;border-radius:12px;"></iframe>';
      break;
    case 'dashboard': {
      const mod = await import('../components/ResultsDashboard.js');
      new mod.default(container);
      break;
    }
    case 'whiteboard':
      container.innerHTML = '<iframe src="/whiteboard.html" style="width:100%;height:700px;border:none;border-radius:12px;"></iframe>';
      break;
  }
}
// Show Windgap Academy branding splash or Avatar Creator by default
window.showFeature('avatar');
