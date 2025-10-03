/**
 * Example exercises using ExerciseComponents
 */

import React, { useState } from "react";
import {
  Exercise,
  Feedback,
  FractionInput,
  Hint,
  MathInput,
  MultipleChoice,
  NumberLineInput,
  TextInput,
  Timer,
  checkAnswer,
} from "../components/ExerciseComponents";
import { FunctionPlot, Graph } from "../components/GraphComponents";
import { BlockMath, InlineMath } from "../components/MathComponents";

/**
 * Container for each example exercise
 */
interface ExampleProps {
  title: string;
  children: React.ReactNode;
}

const Example: React.FC<ExampleProps> = ({ title, children }) => (
  <div className="exercise-example mb-8">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="exercise-container">{children}</div>
  </div>
);

/**
 * Component showcasing all exercise components
 */
export const ExerciseExamples: React.FC = () => {
  return (
    <div className="exercise-examples p-4">
      <h1 className="text-2xl font-bold mb-6">Exercise Components Examples</h1>

      <Example title="Basic Math Question">
        <Exercise title="Solve the equation">
          <div className="mb-4">
            <BlockMath math="3x + 5 = 14" />
            <p className="my-2">What is the value of x?</p>
          </div>

          <BasicMathExample />
        </Exercise>
      </Example>

      <Example title="Multiple Choice Question">
        <Exercise title="Choose the correct answer">
          <div className="mb-4">
            <p className="mb-2">
              Which of the following is equivalent to <InlineMath math="2x^2 + 5x - 3" />?
            </p>
          </div>

          <MultipleChoiceExample />
        </Exercise>
      </Example>

      <Example title="Fraction Input">
        <Exercise title="Simplify the fraction">
          <div className="mb-4">
            <BlockMath math="\frac{24}{36}" />
            <p className="my-2">Express the fraction in lowest terms:</p>
          </div>

          <FractionInputExample />
        </Exercise>
      </Example>

      <Example title="Number Line Exercise">
        <Exercise title="Plot Points on Number Line">
          <div className="mb-4">
            <p className="mb-2">
              Plot the points <InlineMath math="-3, -1, 2, \text{ and } 4" /> on the number line
              below. Click on the line to add points and click on existing points to remove them.
            </p>
          </div>

          <NumberLineExample />
        </Exercise>
      </Example>

      <Example title="Graph Analysis Question">
        <Exercise title="Function Analysis">
          <div className="mb-4">
            <p>Consider the quadratic function below:</p>

            <div className="my-4">
              <Graph
                width={500}
                height={300}
                config={{
                  range: [
                    [-5, 5],
                    [-2, 8],
                  ],
                  showGrid: true,
                  axisArrows: "all",
                }}
              >
                <FunctionPlot fn={(x) => x * x} style={{ stroke: "#4C9AFF", strokeWidth: 2 }} />
              </Graph>
            </div>

            <p className="my-2">What is the equation of this function?</p>
          </div>

          <GraphAnalysisExample />
        </Exercise>
      </Example>

      <Example title="Timed Exercise">
        <Exercise title="Quick Calculations (30 seconds)">
          <TimedExampleContent />
        </Exercise>
      </Example>
    </div>
  );
};

/**
 * Example components for each exercise type
 */

// Basic math example with text input
const BasicMathExample: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleCheck = () => {
    const isCorrect = checkAnswer.numeric(answer, 3);
    setFeedback(isCorrect);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="mr-2">x = </div>
        <TextInput value={answer} onChange={setAnswer} />
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCheck}>
          Check
        </button>
      </div>

      <Feedback
        isCorrect={feedback}
        correctMessage="Correct! 3x + 5 = 14 means x = 3"
        incorrectMessage="Not quite. Try solving step by step: 3x + 5 = 14, then 3x = 9, then x = 3"
      />

      <Hint>
        <p>To solve for x, follow these steps:</p>
        <ol className="list-decimal list-inside ml-4 mt-2">
          <li>Subtract 5 from both sides: 3x = 14 - 5 = 9</li>
          <li>Divide both sides by 3: x = 9 ÷ 3 = 3</li>
        </ol>
      </Hint>
    </>
  );
};

// Multiple choice example
const MultipleChoiceExample: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const choices = ["2x^2 - 5x - 3", "2x^2 + 5x + 3", "(2x - 1)(x + 3)", "(2x + 3)(x - 1)"];

  const correctIndex = 2; // (2x - 1)(x + 3)

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setShowFeedback(false);
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  return (
    <>
      <MultipleChoice
        choices={choices}
        correctIndex={correctIndex}
        onSelect={handleSelect}
        showFeedback={showFeedback}
        mathMode={true}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={handleCheck}
        disabled={selectedIndex === null}
      >
        Check
      </button>

      {showFeedback && selectedIndex === correctIndex && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          <p>
            Correct! When expanded, <InlineMath math="(2x - 1)(x + 3)" /> gives:
          </p>
          <BlockMath math="2x(x+3) - 1(x+3) = 2x^2 + 6x - x - 3 = 2x^2 + 5x - 3" />
        </div>
      )}

      {showFeedback && selectedIndex !== null && selectedIndex !== correctIndex && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p>
            Not quite. Try expanding <InlineMath math="(2x - 1)(x + 3)" /> to verify.
          </p>
        </div>
      )}

      <Hint>
        <p>
          To check each option, expand the factored form and see if it equals{" "}
          <InlineMath math="2x^2 + 5x - 3" />.
        </p>
        <p className="mt-2">
          For example, expand <InlineMath math="(2x - 1)(x + 3)" /> and check if it equals the
          original expression.
        </p>
      </Hint>
    </>
  );
};

// Fraction input example
const FractionInputExample: React.FC = () => {
  const [fraction, setFraction] = useState({ numerator: "", denominator: "" });
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleCheck = () => {
    const isCorrect = checkAnswer.fraction(fraction, { numerator: 2, denominator: 3 });
    setFeedback(isCorrect);
  };

  return (
    <>
      <div className="flex items-center">
        <FractionInput value={fraction} onChange={setFraction} />
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCheck}>
          Check
        </button>
      </div>

      <Feedback
        isCorrect={feedback}
        correctMessage="Correct! 24/36 simplifies to 2/3"
        incorrectMessage="Not quite. Try finding the GCD of 24 and 36, then divide both numbers by it."
      />

      <Hint>
        <p>To simplify a fraction, follow these steps:</p>
        <ol className="list-decimal list-inside ml-4 mt-2">
          <li>Find the greatest common divisor (GCD) of the numerator and denominator.</li>
          <li>Divide both the numerator and denominator by the GCD.</li>
        </ol>
        <p className="mt-2">In this case, the GCD of 24 and 36 is 12.</p>
        <p>24 ÷ 12 = 2</p>
        <p>36 ÷ 12 = 3</p>
        <p>So the simplified fraction is 2/3.</p>
      </Hint>
    </>
  );
};

// Number line example
const NumberLineExample: React.FC = () => {
  const [points, setPoints] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const expectedPoints = [-3, -1, 2, 4];

  const handleCheck = () => {
    // Check if all expected points are present, and no extra points
    const isCorrect =
      points.length === expectedPoints.length && expectedPoints.every((p) => points.includes(p));

    setFeedback(isCorrect);
  };

  return (
    <>
      <NumberLineInput
        min={-5}
        max={5}
        width={500}
        tickStep={1}
        initialValues={points}
        onChange={setPoints}
      />

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCheck}>
        Check
      </button>

      <Feedback
        isCorrect={feedback}
        correctMessage="Correct! You've placed all points in the right positions."
        incorrectMessage={`Not quite. Make sure you have only placed points at ${expectedPoints.join(", ")}.`}
      />
    </>
  );
};

// Graph analysis example
const GraphAnalysisExample: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleCheck = () => {
    const isCorrect = checkAnswer.expression(answer, "x^2");
    setFeedback(isCorrect);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="mr-2">f(x) = </div>
        <MathInput
          value={answer}
          onChange={setAnswer}
          showPreview={true}
          style={{ width: "180px" }}
        />
        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCheck}>
          Check
        </button>
      </div>

      <Feedback
        isCorrect={feedback}
        correctMessage="Correct! The equation is f(x) = x²"
        incorrectMessage="Not quite. Look at the shape of the parabola and its position."
      />

      <Hint>
        <p>Look at these features of the graph:</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>The graph is a parabola opening upward</li>
          <li>It passes through the origin (0,0)</li>
          <li>When x = 1, y = 1</li>
          <li>When x = -1, y = 1</li>
        </ul>
        <p className="mt-2">The simplest quadratic function with these properties is f(x) = x²</p>
      </Hint>
    </>
  );
};

// Timed exercise example
const TimedExampleContent: React.FC = () => {
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const handleInputChange = (question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    setSubmitted(true);
  };

  // Calculate score
  const score = submitted
    ? [
        checkAnswer.numeric(answers.q1, 20),
        checkAnswer.numeric(answers.q2, 42),
        checkAnswer.numeric(answers.q3, 15),
      ].filter((correct) => correct).length
    : 0;

  return (
    <>
      <div className="mb-4">
        <Timer duration={30} onComplete={handleTimeUp} />
      </div>

      <div className={`questions-container ${submitted ? "opacity-50" : ""}`}>
        <div className="mb-3">
          <p className="mb-2">1. What is 8 + 12?</p>
          <TextInput
            value={answers.q1}
            onChange={(value) => handleInputChange("q1", value)}
            disabled={submitted}
          />
          {submitted && (
            <span className="ml-3">{checkAnswer.numeric(answers.q1, 20) ? "✓" : "✗"}</span>
          )}
        </div>

        <div className="mb-3">
          <p className="mb-2">2. What is 6 × 7?</p>
          <TextInput
            value={answers.q2}
            onChange={(value) => handleInputChange("q2", value)}
            disabled={submitted}
          />
          {submitted && (
            <span className="ml-3">{checkAnswer.numeric(answers.q2, 42) ? "✓" : "✗"}</span>
          )}
        </div>

        <div className="mb-3">
          <p className="mb-2">3. What is 45 ÷ 3?</p>
          <TextInput
            value={answers.q3}
            onChange={(value) => handleInputChange("q3", value)}
            disabled={submitted}
          />
          {submitted && (
            <span className="ml-3">{checkAnswer.numeric(answers.q3, 15) ? "✓" : "✗"}</span>
          )}
        </div>
      </div>

      {!submitted && (
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleSubmit}>
          Submit
        </button>
      )}

      {submitted && (
        <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-md">
          <h3 className="text-lg font-bold mb-2">{timeUp ? "Time's up!" : "Results"}</h3>
          <p>You scored {score} out of 3 questions.</p>
          <div className="mt-2">
            <p>Answers:</p>
            <ol className="list-decimal list-inside ml-4">
              <li>8 + 12 = 20</li>
              <li>6 × 7 = 42</li>
              <li>45 ÷ 3 = 15</li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseExamples;
