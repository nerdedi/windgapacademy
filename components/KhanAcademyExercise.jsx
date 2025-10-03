/**
 * Khan Academy Exercise Embed Component
 * Embeds Khan Academy exercises directly into Windgap Academy
 */
const KhanAcademyExercise = ({ exerciseId, width = "100%", height = "600px" }) => {
  // Handle URL formatting based on exercise type
  const getExerciseUrl = () => {
    if (exerciseId.includes("/")) {
      // If exerciseId includes a path, it's likely a full path
      return `https://www.khanacademy.org/embed/${exerciseId}`;
    }

    // Default to exercises format
    return `https://www.khanacademy.org/embed_exercise?exercise=${exerciseId}`;
  };

  return (
    <div className="khan-academy-exercise">
      <div className="exercise-container" style={{ position: "relative", width, height }}>
        <iframe
          src={getExerciseUrl()}
          title={`Khan Academy Exercise: ${exerciseId}`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0 }}
        ></iframe>
      </div>
      <div
        className="attribution"
        style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#666" }}
      >
        Content provided by{" "}
        <a href="https://www.khanacademy.org" target="_blank" rel="noopener noreferrer">
          Khan Academy
        </a>
      </div>
    </div>
  );
};

export default KhanAcademyExercise;
