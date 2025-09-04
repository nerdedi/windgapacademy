export async function loadModule(modulePath: string) {
  // Simple dynamic loader for curriculum JSON files
  try {
    const mod = await import(/* @vite-ignore */ modulePath);
    return mod.default || mod;
  } catch (err) {
    console.error("Failed to load module", modulePath, err);
    return null;
  }
}
