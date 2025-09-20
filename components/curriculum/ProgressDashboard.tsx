type Goal = { title: string; progress: number };

export function LearnerCard({ name, goals = [] }: { name: string; goals?: Goal[] }) {
  return (
    <div className="learner-card">
      <h3>{name}</h3> {/* Display learner's name */}
      <h4>Goals:</h4> {/* List of goals */}
      <ul>
        {goals.length === 0 ? <li>No goals set.</li> : null} {/* Handle no goals case */}
        {goals.map((g, i) => (
          <li key={i}>
            {g.title}: {g.progress}% {/* Display goal title and progress */}
            <button>Edit</button> {/* Edit button for each goal */}
            <button>Delete</button> {/* Delete button for each goal */}
            <button>View Details</button> {/* View Details button for each goal */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProgressDashboard() {
  return (
    <div>
      <h2>Progress Dashboard</h2> {/* Main dashboard title */}
      <LearnerCard
        name="Alex Johnson"
        goals={[
          { title: "Learn to cook", progress: 70 },
          { title: "Improve math skills", progress: 50 },
        ]}
      />
      <LearnerCard name="Maria Garcia" goals={[{ title: "Read 5 books", progress: 20 }]} />{" "}
      {/* Example learner cards */}
      <LearnerCard name="Jenna Luu" goals={[{ title: "Use public transport", progress: 40 }]} />
    </div>
  );
}
