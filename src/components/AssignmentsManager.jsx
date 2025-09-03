import React, { useEffect, useState } from "react";

const AssignmentsManager = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then(setAssignments);
  }, []);

  const handleCreate = () => {
    // Open modal to create assignment
  };

  return (
    <div className="assignments-manager mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Assignments</h2>
      <button onClick={handleCreate} className="mb-2 px-4 py-2 bg-blue-600 text-white rounded">
        Create Assignment
      </button>
      <ul>
        {assignments.length === 0 ? (
          <li>No assignments found</li>
        ) : (
          assignments.map((a) => (
            <li key={a.id} className="py-1">
              {a.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AssignmentsManager;
