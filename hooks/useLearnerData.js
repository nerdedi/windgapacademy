
import { useEffect, useState } from "react";
const { getDb } = require("../src/app/firestoreClient");

export function useLearnerData() {
  const [learners, setLearners] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      const db = getDb();
      if (!db) {
        // no firestore available in this environment, return empty list
        setLearners([]);
        return;
      }
      try {
        // eslint-disable-next-line global-require
        const { collection, getDocs } = require("firebase/firestore");
        const snap = await getDocs(collection(db, "users"));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (mounted) setLearners(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to fetch learners", e);
        if (mounted) setLearners([]);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, []);

  return learners;
}
