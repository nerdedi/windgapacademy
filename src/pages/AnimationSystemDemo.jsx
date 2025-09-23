import EnhancedCharacterAnimationController from "../components/EnhancedCharacterAnimationController";

/**
 * Demo page for the Unity Animation System using the Enhanced Character Animation Controller.
 * This page showcases how to use the Unity Animation System Extension to control character
 * animations from React without any manual setup in Unity.
 */
const AnimationSystemDemo = () => {
  // Character options
  const characters = [
    { id: "winnie", name: "Winnie" },
    { id: "natalie", name: "Natalie" },
  ];

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Unity Animation System Demo</h1>
      <p>
        This demo showcases the Unity Animation System Extension that allows you to control
        character animations from React without any manual setup in Unity.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          marginTop: "32px",
        }}
      >
        <section>
          <h2>How It Works</h2>
          <ol style={{ lineHeight: "1.6" }}>
            <li>
              <strong>Automatic Setup:</strong> The Unity Animation System Extension automatically
              adds all necessary components to your character models in Unity.
            </li>
            <li>
              <strong>React Integration:</strong> The EnhancedCharacterAnimationController component
              provides a UI for controlling animations from React.
            </li>
            <li>
              <strong>No Manual Configuration:</strong> You don&apos;t need to manually add any
              components or write any C# code in Unity.
            </li>
          </ol>
        </section>

        <section>
          <h2>Animation Controls</h2>
          <p>
            Use the controls below to animate the characters. These controls interact with the Unity
            Animation System Extension through the UnityAnimationBridge.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              marginTop: "24px",
            }}
          >
            {characters.map((character) => (
              <div key={character.id}>
                <h3>{character.name}</h3>
                <EnhancedCharacterAnimationController
                  characterId={character.id}
                  width={400}
                  height={300}
                  showControls={true}
                  defaultAnimation="idle"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Unity Setup Instructions</h2>
          <ol style={{ lineHeight: "1.6" }}>
            <li>Import the Unity Animation System Extension scripts into your Unity project.</li>
            <li>
              In Unity, go to{" "}
              <code>
                Windgap Academy {">"} Animation System {">"} Setup Wizard
              </code>
            </li>
            <li>Select your character models and click &quot;Setup Animation System&quot;</li>
            <li>
              That&apos;s it! The extension will automatically add all necessary components and set
              up the React integration.
            </li>
          </ol>
        </section>

        <section>
          <h2>Animation Types</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Basic Animations</h3>
              <p>Simple animations that play once or loop.</p>
              <ul>
                <li>Talk</li>
                <li>Idle</li>
                <li>Teaching</li>
                <li>Celebrate</li>
              </ul>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Emotes</h3>
              <p>Emotional expressions and reactions.</p>
              <ul>
                <li>Happy</li>
                <li>Sad</li>
                <li>Surprised</li>
                <li>Confused</li>
              </ul>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Procedural Animations</h3>
              <p>Dynamic animations controlled by code.</p>
              <ul>
                <li>Look At</li>
                <li>Point At</li>
                <li>Hand Movement</li>
                <li>Head Tracking</li>
              </ul>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Sequences</h3>
              <p>Chains of animations played in order.</p>
              <ul>
                <li>Greeting Sequence</li>
                <li>Teaching Sequence</li>
                <li>Custom Sequences</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimationSystemDemo;
