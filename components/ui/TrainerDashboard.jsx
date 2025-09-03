import Card from "./Card";

const TrainerDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Trainer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Manage Users" link="/users" />
        <Card title="Create Assignments" link="/assignments/new" />
        <Card title="Upload Materials" link="/materials/new" />
        <Card title="Review Feedback" link="/feedback" />
        <Card title="Analytics" link="/analytics" />
      </div>
    </div>
  );
};

export default TrainerDashboard;
