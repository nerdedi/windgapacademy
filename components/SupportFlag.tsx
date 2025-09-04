import React from "react";

export default function SupportFlag({ needsHelp }) {
  const color = needsHelp ? "text-red-600" : "text-green-600";
  return (
    <p className={`text-sm ${needsHelp ? "text-red-600" : "text-green-600"}`}>
      Needs Support: {needsHelp ? "✅" : "❌"}
    </p>
  );
}
