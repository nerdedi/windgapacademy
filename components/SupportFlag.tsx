import React from "react";

export default function SupportFlag({ needsHelp }) {
  return (
    <p className={`text-sm ${needsHelp ? "text-red-600" : "text-green-600"}`}>
      Needs Support: {needsHelp ? "✅" : "❌"}
    </p>
  );
}
