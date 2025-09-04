import React, { useState } from "react";

import { loadModule } from "../src/utils/curriculumLoader";

export default function ModuleBuilder() {
  const [module, setModule] = useState(null);
  const [path, setPath] = useState(
    "/workspaces/windgapacademy/curriculum/life-skills/travel-training.json",
  );

  const handleLoad = async () => {
    const m = await loadModule(path);
    setModule(m);
  };

  return (
    <div className="p-4">
      <h2>Module Builder (preview)</h2>
      <input value={path} onChange={(e) => setPath(e.target.value)} className="border p-2 w-full" />
      <button onClick={handleLoad} className="btn mt-2">
        Load
      </button>
      {module && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
          {JSON.stringify(module, null, 2)}
        </pre>
      )}
    </div>
  );
}
