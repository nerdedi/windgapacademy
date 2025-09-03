import React, { useState } from "react";

function MoneyMatchingGame() {
  // Example: Match coins to values
  return (
    <div className="mb-4">
      <h4>Match the coin to its value</h4>
      {/* ...interactive matching UI... */}
      <p>Drag and drop coins to the correct value.</p>
    </div>
  );
}

function ShoppingListActivity() {
  // Example: Build a shopping list and total cost
  return (
    <div className="mb-4">
      <h4>Shopping List Activity</h4>
      {/* ...interactive shopping list UI... */}
      <p>Select items and calculate the total cost.</p>
    </div>
  );
}

function RolePlayScenario() {
  // Example: Role-play buying items and receiving change
  return (
    <div className="mb-4">
      <h4>Role Play: Buying and Change</h4>
      {/* ...role-play scenario UI... */}
      <p>Practice buying items and getting the correct change.</p>
    </div>
  );
}

function NumeracyChecklist() {
  // Example: Checklist for assessment
  return (
    <div className="mb-4">
      <h4>Numeracy Skills Checklist</h4>
      <ul>
        <li>Recognises coins and notes</li>
        <li>Adds together different combinations</li>
        <li>Calculates change</li>
      </ul>
    </div>
  );
}

function EasyReadMoneyVisuals() {
  // Example: Easy Read visuals for money
  return (
    <div className="mb-4">
      <h4>Easy Read: Money Visuals</h4>
      <img src="/assets/easy-read/money-coins.png" alt="Money visuals" />
    </div>
  );
}

export default function NumeracyCountingMoneyLesson() {
  const objectives = [
    "Recognise Australian coins and notes",
    "Add together different combinations of notes",
    "Participate in practice activity using menu and prices",
  ];
  return (
    <div className="lesson-module p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Numeracy: Counting Money</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Learning Objectives</h3>
        <ul className="list-disc ml-6">
          {objectives.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          ))}
        </ul>
      </div>
      <MoneyMatchingGame />
      <ShoppingListActivity />
      <RolePlayScenario />
      <NumeracyChecklist />
      <EasyReadMoneyVisuals />
    </div>
  );
}
