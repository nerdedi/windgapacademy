// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
import React from "react";
import { useNavigate } from "react-router-dom";

function EmailActivity() {
  return <div>Email Activity Placeholder</div>;
}

function OnlineSafetyActivity() {
  return <div>Online Safety Activity Placeholder</div>;
}

function WebSearchActivity() {
  return <div>Web Search Activity Placeholder</div>;
}

export default function DigitalLiteracyLesson() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Digital Literacy Lesson</h1>
      <EmailActivity />
      <OnlineSafetyActivity />
      <WebSearchActivity />
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
}
