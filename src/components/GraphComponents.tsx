/**
 * GraphComponents - React components for interactive graphs
 *
 * Adapted from Khan Academy's graphie.js and graphie-helpers.js
 * to work with modern React and SVG.
 */

import React, { useEffect, useState } from "react";

/**
 * GraphConfig interface
 */
interface GraphConfig {
  range?: [[number, number], [number, number]];
  scale?: [number, number];
  gridStep?: [number, number];
  tickStep?: [number, number];
  labelStep?: [number, number];
  gridOpacity?: number;
  axisOpacity?: number;
  tickOpacity?: number;
  labelOpacity?: number;
  axisArrows?: "none" | "positive" | "all";
  showGrid?: boolean;
  showTicks?: boolean;
  showLabels?: boolean;
}

/**
 * Graph point type
 */
type Point = [number, number];

/**
 * GraphStyle interface
 */
interface GraphStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
  fill?: string;
  fillOpacity?: number;
  color?: string;
  opacity?: number;
  fontSize?: number;
}

/**
 * Main Graph component
 */
export const Graph: React.FC<{
  width: number;
  height: number;
  config?: GraphConfig;
  children?: React.ReactNode;
  className?: string;
}> = ({ width, height, config = {}, children, className = "" }) => {
  const {
    range = [
      [-10, 10],
      [-10, 10],
    ],
    scale = [1, 1],
    gridStep = [1, 1],
    tickStep = [1, 1],
    labelStep = [1, 1],
    gridOpacity = 0.3,
    axisOpacity = 1.0,
    tickOpacity = 0.8,
    labelOpacity = 0.8,
    axisArrows = "none",
    showGrid = true,
    showTicks = true,
    showLabels = true,
  } = config;

  // Calculate actual dimensions for scaling
  const pixelRange: [number, number] = [width, height];
  const unitRange: [number, number] = [range[0][1] - range[0][0], range[1][1] - range[1][0]];

  // Graph context - will be passed to children through props
  const graphContext = {
    range,
    scale,
    pixelRange,
    unitRange,
    scalePoint: (point: Point): Point => [
      ((point[0] - range[0][0]) / unitRange[0]) * pixelRange[0],
      pixelRange[1] - ((point[1] - range[1][0]) / unitRange[1]) * pixelRange[1],
    ],
    unscalePoint: (point: Point): Point => [
      (point[0] / pixelRange[0]) * unitRange[0] + range[0][0],
      range[1][0] + ((pixelRange[1] - point[1]) / pixelRange[1]) * unitRange[1],
    ],
  };

  // Create grid lines
  const gridLines = [];
  if (showGrid) {
    // Vertical grid lines
    for (
      let x = Math.ceil(range[0][0] / gridStep[0]) * gridStep[0];
      x <= range[0][1];
      x += gridStep[0]
    ) {
      if (Math.abs(x) < 1e-9) continue; // Skip the axis line
      const p1 = graphContext.scalePoint([x, range[1][0]]);
      const p2 = graphContext.scalePoint([x, range[1][1]]);
      gridLines.push(
        <line
          key={`vgrid-${x}`}
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke="#000"
          strokeWidth={0.5}
          strokeOpacity={gridOpacity}
        />,
      );
    }

    // Horizontal grid lines
    for (
      let y = Math.ceil(range[1][0] / gridStep[1]) * gridStep[1];
      y <= range[1][1];
      y += gridStep[1]
    ) {
      if (Math.abs(y) < 1e-9) continue; // Skip the axis line
      const p1 = graphContext.scalePoint([range[0][0], y]);
      const p2 = graphContext.scalePoint([range[0][1], y]);
      gridLines.push(
        <line
          key={`hgrid-${y}`}
          x1={p1[0]}
          y1={p1[1]}
          x2={p2[0]}
          y2={p2[1]}
          stroke="#000"
          strokeWidth={0.5}
          strokeOpacity={gridOpacity}
        />,
      );
    }
  }

  // Create axis lines
  const axisLines = [];

  // X-axis
  if (range[1][0] <= 0 && range[1][1] >= 0) {
    const y = 0;
    const p1 = graphContext.scalePoint([range[0][0], y]);
    const p2 = graphContext.scalePoint([range[0][1], y]);

    axisLines.push(
      <line
        key="x-axis"
        x1={p1[0]}
        y1={p1[1]}
        x2={p2[0]}
        y2={p2[1]}
        stroke="#000"
        strokeWidth={1}
        strokeOpacity={axisOpacity}
      />,
    );

    // X-axis arrow
    if (axisArrows === "positive" || axisArrows === "all") {
      const arrowSize = 8;
      axisLines.push(
        <polygon
          key="x-arrow"
          points={`${p2[0]},${p2[1]} ${p2[0] - arrowSize},${p2[1] - arrowSize / 2} ${p2[0] - arrowSize},${p2[1] + arrowSize / 2}`}
          fill="#000"
          opacity={axisOpacity}
        />,
      );
    }

    if (axisArrows === "all") {
      const arrowSize = 8;
      axisLines.push(
        <polygon
          key="x-arrow-neg"
          points={`${p1[0]},${p1[1]} ${p1[0] + arrowSize},${p1[1] - arrowSize / 2} ${p1[0] + arrowSize},${p1[1] + arrowSize / 2}`}
          fill="#000"
          opacity={axisOpacity}
        />,
      );
    }
  }

  // Y-axis
  if (range[0][0] <= 0 && range[0][1] >= 0) {
    const x = 0;
    const p1 = graphContext.scalePoint([x, range[1][0]]);
    const p2 = graphContext.scalePoint([x, range[1][1]]);

    axisLines.push(
      <line
        key="y-axis"
        x1={p1[0]}
        y1={p1[1]}
        x2={p2[0]}
        y2={p2[1]}
        stroke="#000"
        strokeWidth={1}
        strokeOpacity={axisOpacity}
      />,
    );

    // Y-axis arrow
    if (axisArrows === "positive" || axisArrows === "all") {
      const arrowSize = 8;
      axisLines.push(
        <polygon
          key="y-arrow"
          points={`${p2[0]},${p2[1]} ${p2[0] - arrowSize / 2},${p2[1] + arrowSize} ${p2[0] + arrowSize / 2},${p2[1] + arrowSize}`}
          fill="#000"
          opacity={axisOpacity}
        />,
      );
    }

    if (axisArrows === "all") {
      const arrowSize = 8;
      axisLines.push(
        <polygon
          key="y-arrow-neg"
          points={`${p1[0]},${p1[1]} ${p1[0] - arrowSize / 2},${p1[1] - arrowSize} ${p1[0] + arrowSize / 2},${p1[1] - arrowSize}`}
          fill="#000"
          opacity={axisOpacity}
        />,
      );
    }
  }

  // Create ticks and labels
  const ticks = [];
  const labels = [];

  if (showTicks || showLabels) {
    // X-axis ticks and labels
    if (range[1][0] <= 0 && range[1][1] >= 0) {
      const y = 0;
      for (
        let x = Math.ceil(range[0][0] / tickStep[0]) * tickStep[0];
        x <= range[0][1];
        x += tickStep[0]
      ) {
        if (Math.abs(x) < 1e-9) continue; // Skip the origin

        const p = graphContext.scalePoint([x, y]);

        // Add tick
        if (showTicks) {
          ticks.push(
            <line
              key={`x-tick-${x}`}
              x1={p[0]}
              y1={p[1] - 5}
              x2={p[0]}
              y2={p[1] + 5}
              stroke="#000"
              strokeWidth={1}
              strokeOpacity={tickOpacity}
            />,
          );
        }

        // Add label
        if (showLabels && x % labelStep[0] === 0) {
          labels.push(
            <text
              key={`x-label-${x}`}
              x={p[0]}
              y={p[1] + 20}
              textAnchor="middle"
              fontSize="12"
              opacity={labelOpacity}
            >
              {x}
            </text>,
          );
        }
      }
    }

    // Y-axis ticks and labels
    if (range[0][0] <= 0 && range[0][1] >= 0) {
      const x = 0;
      for (
        let y = Math.ceil(range[1][0] / tickStep[1]) * tickStep[1];
        y <= range[1][1];
        y += tickStep[1]
      ) {
        if (Math.abs(y) < 1e-9) continue; // Skip the origin

        const p = graphContext.scalePoint([x, y]);

        // Add tick
        if (showTicks) {
          ticks.push(
            <line
              key={`y-tick-${y}`}
              x1={p[0] - 5}
              y1={p[1]}
              x2={p[0] + 5}
              y2={p[1]}
              stroke="#000"
              strokeWidth={1}
              strokeOpacity={tickOpacity}
            />,
          );
        }

        // Add label
        if (showLabels && y % labelStep[1] === 0) {
          labels.push(
            <text
              key={`y-label-${y}`}
              x={p[0] - 10}
              y={p[1]}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="12"
              opacity={labelOpacity}
            >
              {y}
            </text>,
          );
        }
      }
    }

    // Origin label (0,0)
    if (
      showLabels &&
      range[0][0] <= 0 &&
      range[0][1] >= 0 &&
      range[1][0] <= 0 &&
      range[1][1] >= 0
    ) {
      const p = graphContext.scalePoint([0, 0]);
      labels.push(
        <text key="origin-label" x={p[0] - 10} y={p[1] + 20} fontSize="12" opacity={labelOpacity}>
          0
        </text>,
      );
    }
  }

  // Clone children and inject the graph context
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { graphContext });
    }
    return child;
  });

  return (
    <div className={`graph-container ${className}`}>
      <svg width={width} height={height}>
        {/* Grid lines */}
        <g className="grid-lines">{gridLines}</g>

        {/* Axis lines */}
        <g className="axis-lines">{axisLines}</g>

        {/* Ticks */}
        <g className="ticks">{ticks}</g>

        {/* Labels */}
        <g className="labels">{labels}</g>

        {/* Graph elements */}
        <g className="graph-elements">{childrenWithProps}</g>
      </svg>
    </div>
  );
};

/**
 * Line component for graphs
 */
export const Line: React.FC<{
  points: Point[];
  style?: GraphStyle;
  graphContext?: any;
}> = ({ points, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const { stroke = "#000", strokeWidth = 2, strokeOpacity = 1, strokeDasharray = "" } = style;

  const scaledPoints = points.map((p) => graphContext.scalePoint(p));
  const pathData = `M ${scaledPoints.map((p) => `${p[0]},${p[1]}`).join(" L ")}`;

  return (
    <path
      d={pathData}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      strokeDasharray={strokeDasharray}
      fill="none"
    />
  );
};

/**
 * Circle component for graphs
 */
export const Circle: React.FC<{
  center: Point;
  radius: number;
  style?: GraphStyle;
  graphContext?: any;
}> = ({ center, radius, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const {
    stroke = "#000",
    strokeWidth = 2,
    strokeOpacity = 1,
    fill = "none",
    fillOpacity = 0,
  } = style;

  const scaledCenter = graphContext.scalePoint(center);

  // Scale the radius - we use the x-scale
  const scalePoint = graphContext.scalePoint([center[0] + radius, center[1]]);
  const scaledRadius = Math.abs(scalePoint[0] - scaledCenter[0]);

  return (
    <circle
      cx={scaledCenter[0]}
      cy={scaledCenter[1]}
      r={scaledRadius}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill={fill}
      fillOpacity={fillOpacity}
    />
  );
};

/**
 * Point component for graphs (rendered as a circle)
 */
export const Point: React.FC<{
  point: Point;
  size?: number;
  style?: GraphStyle;
  graphContext?: any;
}> = ({ point, size = 5, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const { stroke = "#000", strokeWidth = 1, fill = "#000", fillOpacity = 1 } = style;

  const scaledPoint = graphContext.scalePoint(point);

  return (
    <circle
      cx={scaledPoint[0]}
      cy={scaledPoint[1]}
      r={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      fillOpacity={fillOpacity}
    />
  );
};

/**
 * Polygon component for graphs
 */
export const Polygon: React.FC<{
  points: Point[];
  style?: GraphStyle;
  graphContext?: any;
}> = ({ points, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const {
    stroke = "#000",
    strokeWidth = 2,
    strokeOpacity = 1,
    fill = "none",
    fillOpacity = 0,
  } = style;

  const scaledPoints = points.map((p) => graphContext.scalePoint(p));
  const pointsAttr = scaledPoints.map((p) => `${p[0]},${p[1]}`).join(" ");

  return (
    <polygon
      points={pointsAttr}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill={fill}
      fillOpacity={fillOpacity}
    />
  );
};

/**
 * Text label component for graphs
 */
export const Label: React.FC<{
  point: Point;
  text: string;
  offset?: [number, number];
  style?: GraphStyle;
  graphContext?: any;
}> = ({ point, text, offset = [0, 0], style = {}, graphContext }) => {
  if (!graphContext) return null;

  const { color = "#000", opacity = 1, fontSize = 12 } = style;

  const scaledPoint = graphContext.scalePoint(point);

  return (
    <text
      x={scaledPoint[0] + offset[0]}
      y={scaledPoint[1] + offset[1]}
      fill={color}
      opacity={opacity}
      fontSize={fontSize}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {text}
    </text>
  );
};

/**
 * Function plot component
 */
export const FunctionPlot: React.FC<{
  fn: (x: number) => number;
  domain?: [number, number];
  samples?: number;
  style?: GraphStyle;
  graphContext?: any;
}> = ({ fn, domain, samples = 100, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const xDomain = domain || [graphContext.range[0][0], graphContext.range[0][1]];
  const points: Point[] = [];

  const dx = (xDomain[1] - xDomain[0]) / samples;
  for (let x = xDomain[0]; x <= xDomain[1]; x += dx) {
    try {
      const y = fn(x);
      if (isFinite(y) && !isNaN(y)) {
        points.push([x, y]);
      }
    } catch (e) {
      // Skip points that cause errors
    }
  }

  return <Line points={points} style={style} graphContext={graphContext} />;
};

/**
 * Interactive point that can be dragged
 */
export const InteractivePoint: React.FC<{
  point: Point;
  onChange?: (point: Point) => void;
  constraint?: (point: Point) => Point;
  size?: number;
  style?: GraphStyle;
  graphContext?: any;
}> = ({ point: initialPoint, onChange, constraint, size = 8, style = {}, graphContext }) => {
  if (!graphContext) return null;

  const [point, setPoint] = useState<Point>(initialPoint);
  const [isDragging, setIsDragging] = useState(false);

  const { stroke = "#6495ED", strokeWidth = 2, fill = "#6495ED", fillOpacity = 1 } = style;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGCircleElement>) => {
    if (!isDragging) return;

    const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!svgRect) return;

    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    let newPoint = graphContext.unscalePoint([mouseX, mouseY]);

    // Apply constraint if provided
    if (constraint) {
      newPoint = constraint(newPoint);
    }

    setPoint(newPoint);
    if (onChange) {
      onChange(newPoint);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const scaledPoint = graphContext.scalePoint(point);

  return (
    <circle
      cx={scaledPoint[0]}
      cy={scaledPoint[1]}
      r={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      fillOpacity={fillOpacity}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: "pointer" }}
    />
  );
};

/**
 * Number line component
 */
export const NumberLine: React.FC<{
  min: number;
  max: number;
  width: number;
  height?: number;
  tickStep?: number;
  labelStep?: number;
  showTicks?: boolean;
  showLabels?: boolean;
  className?: string;
}> = ({
  min,
  max,
  width,
  height = 50,
  tickStep = 1,
  labelStep = 1,
  showTicks = true,
  showLabels = true,
  className = "",
}) => {
  const scaleFactor = width / (max - min);

  // Create ticks
  const ticks = [];
  const labels = [];

  if (showTicks || showLabels) {
    for (let value = min; value <= max; value += tickStep) {
      const x = (value - min) * scaleFactor;

      // Add tick
      if (showTicks) {
        ticks.push(
          <line
            key={`tick-${value}`}
            x1={x}
            y1={height / 2 - 10}
            x2={x}
            y2={height / 2 + 10}
            stroke="#000"
            strokeWidth={1}
          />,
        );
      }

      // Add label
      if (showLabels && value % labelStep === 0) {
        labels.push(
          <text key={`label-${value}`} x={x} y={height / 2 + 25} textAnchor="middle" fontSize="12">
            {value}
          </text>,
        );
      }
    }
  }

  return (
    <div className={`number-line-container ${className}`}>
      <svg width={width} height={height}>
        {/* Main line */}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#000" strokeWidth={2} />

        {/* Arrow at the end */}
        <polygon
          points={`${width},${height / 2} ${width - 10},${height / 2 - 5} ${width - 10},${height / 2 + 5}`}
          fill="#000"
        />

        {/* Ticks */}
        <g className="ticks">{ticks}</g>

        {/* Labels */}
        <g className="labels">{labels}</g>
      </svg>
    </div>
  );
};

/**
 * PlotFunction component that renders a function with a given domain and range
 */
export const PlotFunction: React.FC<{
  fn: (x: number) => number;
  domain: [number, number];
  height?: number;
  width?: number;
  range?: [number, number];
  className?: string;
  style?: GraphStyle;
}> = ({ fn, domain, height = 400, width = 600, range, className = "", style = {} }) => {
  // Calculate the range if not provided
  const [minY, maxY] = (() => {
    if (range) return range;

    // Sample the function to find the range
    const samples = 100;
    const dx = (domain[1] - domain[0]) / samples;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let x = domain[0]; x <= domain[1]; x += dx) {
      try {
        const y = fn(x);
        if (isFinite(y) && !isNaN(y)) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      } catch (e) {
        // Skip points that cause errors
      }
    }

    // Add some padding
    const padding = (maxY - minY) * 0.1;
    return [minY - padding, maxY + padding];
  })();

  const graphConfig = {
    range: [domain, [minY, maxY]],
    showGrid: true,
    axisArrows: "all" as const,
  };

  return (
    <Graph width={width} height={height} config={graphConfig} className={className}>
      <FunctionPlot fn={fn} style={style} />
    </Graph>
  );
};

/**
 * Coordinate plane component for simple 2D graphs
 */
export const CoordinatePlane: React.FC<{
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  gridStep?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({
  width = 500,
  height = 500,
  min = -10,
  max = 10,
  gridStep = 1,
  className = "",
  children,
}) => {
  const graphConfig = {
    range: [
      [min, max],
      [min, max],
    ],
    gridStep: [gridStep, gridStep],
    showGrid: true,
    axisArrows: "all" as const,
  };

  return (
    <Graph width={width} height={height} config={graphConfig} className={className}>
      {children}
    </Graph>
  );
};
