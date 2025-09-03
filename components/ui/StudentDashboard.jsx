import Card from "./Card";

const StudentDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="My Assignments" link="/assignments" />
        <Card title="Study Materials" link="/materials" />
        <Card title="Progress Tracker" link="/progress" />
        <Card title="FAQs & Support" link="/faq" />
      </div>
    </div>
  );
};

export default StudentDashboard;
