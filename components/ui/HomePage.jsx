import Card from "./Card";

const HomePage = () => {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#5ED1D2]">Windgap Academy</h1>
        <p className="text-lg text-gray-700 mt-2">
          Accessible, inclusive, and modern learning platform for all.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Interactive Games" link="/games" />
        <Card title="Life Skills Challenges" link="/challenges" />
        <Card title="Trainer Resources" link="/trainer" />
        <Card title="Student Portal" link="/student" />
      </section>
    </main>
  );
};

export default HomePage;
