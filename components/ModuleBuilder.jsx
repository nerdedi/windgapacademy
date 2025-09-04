import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import { app } from "../src/lib/firebaseClient.js";
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

  const handleSave = async () => {
    if (!module) return;
    try {
      const db = getFirestore(app);
      const id = module.id || module.title?.toLowerCase().replace(/\s+/g, "-") || "untitled";
      await setDoc(doc(db, "curriculum", id), module);
      alert("Module saved");
    } catch (e) {
      console.error(e);
      alert("Failed to save module");
    }
  };

  return (
    <div className="p-4">
      <h2>Module Builder (preview)</h2>
      <input value={path} onChange={(e) => setPath(e.target.value)} className="border p-2 w-full" />
      <button onClick={handleLoad} className="btn mt-2">
        Load
      </button>
      <button onClick={handleSave} className="btn mt-2 ml-2">
        Save
      </button>
      {module && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
          {JSON.stringify(module, null, 2)}
        </pre>
      )}
    </div>
  );
}
