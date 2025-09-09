import React, { useState } from "react";

import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

// Example nutrition facts data
const nutritionFacts = [
  { key: "Calories", value: 120, info: "Calories are a measure of energy." },
  {
    key: "Total Fat",
    value: "2g",
    info: "Fat is needed for energy, but too much can be unhealthy.",
  },
  { key: "Sodium", value: "80mg", info: "Sodium is salt. Too much can raise blood pressure." },
  { key: "Total Carbohydrate", value: "24g", info: "Carbs give you energy. Choose whole grains!" },
  { key: "Dietary Fiber", value: "3g", info: "Fiber helps digestion and keeps you full." },
  { key: "Sugars", value: "12g", info: "Sugar gives quick energy, but too much is unhealthy." },
  { key: "Protein", value: "4g", info: "Protein builds muscles and repairs your body." },
];

export default function NutritionLabelDemo() {
  const [info, setInfo] = useState("");

  return (
    <div
      className="nutrition-label-demo font-[Archivo Black] p-6 max-w-xs bg-white rounded shadow-lg border border-gray-300"
      role="region"
      aria-label="Nutrition Label Demo"
    >
      <h2 className="text-xl mb-2">Nutrition Facts</h2>
      <Spinner show={false} size={24} className="mx-auto" />
      <div className="nutrition-label">
        {nutritionFacts.map((fact) => (
          <Tooltip key={fact.key} text={`Show info for ${fact.key}`}>
            <button
              className="block w-full text-left px-2 py-1 rounded hover:bg-blue-100 mb-1"
              aria-label={`Show info for ${fact.key}`}
              onClick={() => setInfo(fact.info)}
            >
              {fact.key}: {fact.value}
            </button>
          </Tooltip>
        ))}
      </div>
      {info && <div className="mt-4 p-2 bg-yellow-100 rounded text-sm">{info}</div>}
      <div className="mt-2 text-xs text-gray-500">Tip: Click a row to view more info.</div>
    </div>
  );
}
