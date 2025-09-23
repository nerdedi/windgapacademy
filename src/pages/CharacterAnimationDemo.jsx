import CharacterAnimationController from "../components/CharacterAnimationController";

/**
 * Character Animation Demo Page
 * Demonstrates controlling Unity animations from React
 */
const CharacterAnimationDemo = () => {
  return (
    <div className="character-animation-demo-page">
      <h1>Character Animation Demo</h1>

      <p className="description">
        This demo showcases how to control Unity animations using code through the React interface.
        Use the controls below to trigger different animations on the character.
      </p>

      <CharacterAnimationController characterId="Winnie" width={800} height={450} />

      <div className="code-explanation">
        <h2>How It Works</h2>

        <p>
          The animations you see are controlled through code, both in Unity and React. Here&apos;s
          an overview of how it works:
        </p>

        <div className="code-example">
          <h3>React Code Example</h3>
          <pre>
            {`// Trigger an animation from React
const playAnimation = (animationName, duration) => {
  sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
    actionType: 'START_ANIMATION',
    characterName: 'Winnie',
    animationName: animationName,
    duration: duration
  });
};

// Play a sequence of animations
const playSequence = () => {
  sendToUnity('ReactBridgeManager', 'ReceiveFromReact', {
    actionType: 'PLAY_SEQUENCE',
    characterId: 'Winnie',
    sequence: [
      { animation: 'talk', duration: 2.0 },
      { animation: 'think', duration: 1.5 },
      { animation: 'celebrate', duration: 1.0 }
    ]
  });
};`}
          </pre>
        </div>

        <div className="code-example">
          <h3>Unity C# Code Example</h3>
          <pre>
            {`// In AnimationController.cs
public void PlayAnimation(string animationName)
{
    // Get animation state hash from name
    if (animationStates.TryGetValue(animationName, out int stateHash))
    {
        // Crossfade to the new animation
        animator.CrossFade(stateHash, crossFadeDuration);
        currentAnimation = animationName;

        // Log the animation
        Debug.Log($"Playing animation: {animationName}");
    }
}

// Play an animation sequence
sequencePlayer.StartSequence()
    .Then("talk", 2.0f)
    .Then("think", 1.5f)
    .Then("celebrate", 1.0f)
    .EndWithIdle();`}
          </pre>
        </div>
      </div>

      <div className="next-steps">
        <h2>Next Steps</h2>
        <p>Want to create your own coded animations? Check out the documentation:</p>
        <ul>
          <li>
            <a href="/docs/unity-code-animation-guide.md" target="_blank">
              Unity Code Animation Guide
            </a>
          </li>
          <li>
            <a href="/docs/animation-rigging-guide.md" target="_blank">
              Animation Rigging Guide
            </a>
          </li>
          <li>
            <a href="/docs/unity-input-system-guide.md" target="_blank">
              Unity Input System Guide
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CharacterAnimationDemo;

// CSS for this page
const style = document.createElement("style");
style.textContent = `
  .character-animation-demo-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .character-animation-demo-page h1 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--primary-color);
  }

  .description {
    text-align: center;
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 1.5;
  }

  .code-explanation {
    margin-top: 40px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .code-explanation h2 {
    color: var(--secondary-color);
    margin-bottom: 15px;
  }

  .code-example {
    margin-top: 20px;
    margin-bottom: 30px;
  }

  .code-example h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #555;
  }

  .code-example pre {
    background-color: #f1f1f1;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.4;
  }

  .next-steps {
    margin-top: 40px;
    padding: 20px;
    background-color: #f0f7ff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .next-steps h2 {
    color: var(--primary-color);
    margin-bottom: 15px;
  }

  .next-steps ul {
    list-style-type: none;
    padding: 0;
  }

  .next-steps li {
    margin-bottom: 10px;
  }

  .next-steps a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    padding: 5px 0;
  }

  .next-steps a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(style);
