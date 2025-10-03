/**
 * Example graphs showing usage of GraphComponents
 */

import React, { useState } from "react";
import {
  Circle,
  CoordinatePlane,
  FunctionPlot,
  Graph,
  InteractivePoint,
  Label,
  Line,
  NumberLine,
  PlotFunction,
  Point,
} from "./GraphComponents";

interface GraphDemoProps {
  title: string;
  children: React.ReactNode;
}

const GraphDemo: React.FC<GraphDemoProps> = ({ title, children }) => (
  <div className="graph-demo mb-8">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="graph-container border border-gray-300 rounded-lg p-4">{children}</div>
  </div>
);

export const GraphExamples: React.FC = () => {
  // State for interactive example
  const [pointA, setPointA] = useState<[number, number]>([2, 3]);
  const [pointB, setPointB] = useState<[number, number]>([-3, 1]);

  // Constraint for points on a circle
  const constrainToCircle = (point: [number, number]): [number, number] => {
    // Constrain to circle with radius 5
    const r = 5;
    const d = Math.sqrt(point[0] * point[0] + point[1] * point[1]);
    if (d > r) {
      return [(point[0] * r) / d, (point[1] * r) / d];
    }
    return point;
  };

  // Calculate distance between points for the interactive example
  const distance = Math.sqrt(
    Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2),
  ).toFixed(2);

  return (
    <div className="graph-examples p-4">
      <h1 className="text-2xl font-bold mb-6">Graph Components Examples</h1>

      <GraphDemo title="Basic Coordinate Plane">
        <CoordinatePlane width={500} height={500} min={-10} max={10}>
          <Point point={[3, 4]} size={5} />
          <Point point={[-2, -5]} size={5} style={{ fill: "red" }} />
          <Line
            points={[
              [3, 4],
              [-2, -5],
            ]}
            style={{ stroke: "blue", strokeWidth: 2 }}
          />
        </CoordinatePlane>
      </GraphDemo>

      <GraphDemo title="Function Plot">
        <PlotFunction
          fn={(x) => Math.sin(x) * 2}
          domain={[-Math.PI * 2, Math.PI * 2]}
          width={600}
          height={400}
          style={{ stroke: "#4C9AFF", strokeWidth: 3 }}
        />
      </GraphDemo>

      <GraphDemo title="Parabola with Points">
        <Graph
          width={500}
          height={400}
          config={{
            range: [
              [-5, 5],
              [-2, 8],
            ],
            gridStep: [1, 1],
            showGrid: true,
            axisArrows: "all",
          }}
        >
          {/* Parabola y = x^2 */}
          <FunctionPlot fn={(x) => x * x} style={{ stroke: "#6495ED", strokeWidth: 2.5 }} />

          {/* Points on the parabola */}
          <Point point={[-2, 4]} style={{ fill: "#FF5733" }} />
          <Point point={[0, 0]} style={{ fill: "#FF5733" }} />
          <Point point={[2, 4]} style={{ fill: "#FF5733" }} />

          {/* Labels */}
          <Label point={[-2, 4]} text="(-2, 4)" offset={[0, -15]} />
          <Label point={[0, 0]} text="(0, 0)" offset={[0, -15]} />
          <Label point={[2, 4]} text="(2, 4)" offset={[0, -15]} />
        </Graph>
      </GraphDemo>

      <GraphDemo title="Circle and Lines">
        <Graph
          width={500}
          height={500}
          config={{
            range: [
              [-6, 6],
              [-6, 6],
            ],
            gridStep: [1, 1],
            showGrid: true,
            axisArrows: "all",
          }}
        >
          {/* Circle with radius 4 */}
          <Circle
            center={[0, 0]}
            radius={4}
            style={{
              stroke: "#9C27B0",
              strokeWidth: 2,
              fill: "#E1BEE7",
              fillOpacity: 0.3,
            }}
          />

          {/* Diameter line */}
          <Line
            points={[
              [-4, 0],
              [4, 0],
            ]}
            style={{
              stroke: "#2196F3",
              strokeWidth: 1.5,
              strokeDasharray: "5,5",
            }}
          />

          {/* Radius lines */}
          <Line
            points={[
              [0, 0],
              [0, 4],
            ]}
            style={{ stroke: "#4CAF50", strokeWidth: 1.5 }}
          />
          <Line
            points={[
              [0, 0],
              [0, -4],
            ]}
            style={{ stroke: "#4CAF50", strokeWidth: 1.5 }}
          />
          <Line
            points={[
              [0, 0],
              [4, 0],
            ]}
            style={{ stroke: "#4CAF50", strokeWidth: 1.5 }}
          />
          <Line
            points={[
              [0, 0],
              [-4, 0],
            ]}
            style={{ stroke: "#4CAF50", strokeWidth: 1.5 }}
          />

          {/* Labels */}
          <Label point={[0, 0]} text="O" />
          <Label point={[0, 4]} text="(0, 4)" offset={[0, -15]} />
          <Label point={[2, 0]} text="r = 4" offset={[0, 15]} />
        </Graph>
      </GraphDemo>

      <GraphDemo title="Multiple Functions">
        <Graph
          width={600}
          height={400}
          config={{
            range: [
              [-5, 5],
              [-3, 3],
            ],
            gridStep: [1, 1],
            showGrid: true,
            axisArrows: "all",
          }}
        >
          {/* Linear function y = x */}
          <FunctionPlot fn={(x) => x} style={{ stroke: "#F44336", strokeWidth: 2 }} />

          {/* Sine wave y = sin(x) */}
          <FunctionPlot fn={(x) => Math.sin(x)} style={{ stroke: "#2196F3", strokeWidth: 2 }} />

          {/* Quadratic function y = 0.25x^2 - 1 */}
          <FunctionPlot
            fn={(x) => 0.25 * x * x - 1}
            style={{ stroke: "#4CAF50", strokeWidth: 2 }}
          />

          {/* Labels */}
          <Label point={[3, 3]} text="y = x" style={{ color: "#F44336" }} />
          <Label point={[3, 0.5]} text="y = sin(x)" style={{ color: "#2196F3" }} />
          <Label point={[3, 1.25]} text="y = 0.25x² - 1" style={{ color: "#4CAF50" }} />
        </Graph>
      </GraphDemo>

      <GraphDemo title="Interactive Distance Between Points">
        <Graph
          width={500}
          height={500}
          config={{
            range: [
              [-10, 10],
              [-10, 10],
            ],
            gridStep: [1, 1],
            showGrid: true,
            axisArrows: "all",
          }}
        >
          {/* Constraint circle */}
          <Circle
            center={[0, 0]}
            radius={5}
            style={{
              stroke: "#9E9E9E",
              strokeWidth: 1,
              strokeDasharray: "5,5",
              fillOpacity: 0,
            }}
          />

          {/* Line between points */}
          <Line points={[pointA, pointB]} style={{ stroke: "#2196F3", strokeWidth: 2 }} />

          {/* Interactive points */}
          <InteractivePoint
            point={pointA}
            onChange={setPointA}
            constraint={constrainToCircle}
            size={8}
            style={{ fill: "#F44336" }}
          />

          <InteractivePoint
            point={pointB}
            onChange={setPointB}
            constraint={constrainToCircle}
            size={8}
            style={{ fill: "#4CAF50" }}
          />

          {/* Distance label */}
          <Label
            point={[(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2]}
            text={`d = ${distance}`}
            offset={[0, -15]}
            style={{ fontSize: 14 }}
          />

          {/* Point labels */}
          <Label
            point={pointA}
            text={`A(${pointA[0].toFixed(1)}, ${pointA[1].toFixed(1)})`}
            offset={[0, 20]}
          />

          <Label
            point={pointB}
            text={`B(${pointB[0].toFixed(1)}, ${pointB[1].toFixed(1)})`}
            offset={[0, 20]}
          />
        </Graph>
        <div className="instructions mt-2 text-sm text-gray-600">
          Drag the red and green points to see the distance between them change. Points are
          constrained to the circle.
        </div>
      </GraphDemo>

      <GraphDemo title="Number Line">
        <div className="flex flex-col gap-4">
          <NumberLine min={-10} max={10} width={500} tickStep={1} labelStep={2} />

          <NumberLine min={0} max={20} width={500} tickStep={0.5} labelStep={1} />

          <NumberLine min={-5} max={5} width={500} height={70} tickStep={0.25} labelStep={1} />
        </div>
      </GraphDemo>
    </div>
  );
};

export default GraphExamples;
