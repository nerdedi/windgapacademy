import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function EducatorNotes({ learnerId }: { learnerId: string }) {
  const [note, setNote] = useState("");
  const handleSave = () => {
    const db = getFirestore();
    setDoc(doc(db, "notes", learnerId), { note });
  };

  return (
    <div className="mt-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add educator notes..."
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSave} className="mt-2 btn-primary">
        Save Note
      </button>
    </div>
  );
}
