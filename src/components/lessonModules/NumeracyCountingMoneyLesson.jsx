import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MoneyMatchingGame() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const coins = [
    { id: 1, name: "5c", value: 0.05, emoji: "🪙", color: "bg-yellow-400" },
    { id: 2, name: "10c", value: 0.1, emoji: "🪙", color: "bg-gray-400" },
    { id: 3, name: "20c", value: 0.2, emoji: "🪙", color: "bg-yellow-500" },
    { id: 4, name: "50c", value: 0.5, emoji: "🪙", color: "bg-gray-500" },
    { id: 5, name: "$1", value: 1.0, emoji: "🪙", color: "bg-yellow-600" },
    { id: 6, name: "$2", value: 2.0, emoji: "🪙", color: "bg-yellow-700" },
  ];

  const values = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0];

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  const handleValueMatch = (value) => {
    if (selectedCoin && selectedCoin.value === value) {
      setMatches({ ...matches, [selectedCoin.id]: value });
      setScore(score + 10);
      setSelectedCoin(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">💰 Match Coins to Values</h3>
        <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
          Score: {score}
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-500 text-white p-4 rounded-2xl mb-4 text-center font-bold animate-bounce">
          🎉 Perfect Match! Well done!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Select a Coin:</h4>
          <div className="grid grid-cols-3 gap-4">
            {coins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => handleCoinSelect(coin)}
                disabled={matches[coin.id]}
                className={`${coin.color} ${
                  selectedCoin?.id === coin.id ? "ring-4 ring-blue-500 scale-110" : ""
                } ${
                  matches[coin.id] ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                } p-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg`}
              >
                <div className="text-3xl mb-2">{coin.emoji}</div>
                {coin.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Match to Value:</h4>
          <div className="grid grid-cols-2 gap-4">
            {values.map((value) => (
              <button
                key={value}
                onClick={() => handleValueMatch(value)}
                disabled={Object.values(matches).includes(value)}
                className={`${
                  Object.values(matches).includes(value)
                    ? "bg-green-500 text-white"
                    : "bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300"
                } p-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg`}
              >
                ${value.toFixed(2)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingListActivity() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const items = [
    { id: 1, name: "Apple", price: 1.5, emoji: "🍎" },
    { id: 2, name: "Bread", price: 3.2, emoji: "🍞" },
    { id: 3, name: "Milk", price: 4.5, emoji: "🥛" },
    { id: 4, name: "Banana", price: 2.8, emoji: "🍌" },
    { id: 5, name: "Cheese", price: 6.9, emoji: "🧀" },
    { id: 6, name: "Eggs", price: 5.4, emoji: "🥚" },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
    setTotal(total + item.price);
  };

  const removeFromCart = (index) => {
    const item = cart[index];
    setCart(cart.filter((_, i) => i !== index));
    setTotal(total - item.price);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🛒 Shopping List Calculator</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Available Items:</h4>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 p-4 rounded-2xl transition-all duration-300 shadow-lg hover:scale-105"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-green-600 font-bold">${item.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Your Cart:</h4>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <span>
                      {item.emoji} {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RolePlayScenario() {
  const [customerMoney, setCustomerMoney] = useState(10.0);
  const [itemPrice, setItemPrice] = useState(3.5);
  const [change, setChange] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const calculateChange = () => {
    const calculatedChange = customerMoney - itemPrice;
    setChange(calculatedChange);
    setShowResult(true);
  };

  const resetScenario = () => {
    setCustomerMoney(10.0);
    setItemPrice(3.5);
    setChange(null);
    setShowResult(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🏪 Role Play: Shop Keeper</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Customer&apos;s Money:</h4>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl">💵</span>
            <input
              type="number"
              value={customerMoney}
              onChange={(e) => setCustomerMoney(parseFloat(e.target.value) || 0)}
              className="border-2 border-gray-300 rounded-xl p-3 text-lg font-semibold w-32"
              step="0.05"
              min="0"
            />
          </div>

          <h4 className="text-lg font-semibold mb-4 text-gray-700">Item Price:</h4>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl">🏷️</span>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
              className="border-2 border-gray-300 rounded-xl p-3 text-lg font-semibold w-32"
              step="0.05"
              min="0"
            />
          </div>

          <button
            onClick={calculateChange}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg w-full"
          >
            Calculate Change
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Transaction Result:</h4>
          {showResult && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-lg">
                  <strong>Customer pays:</strong> ${customerMoney.toFixed(2)}
                </p>
                <p className="text-lg">
                  <strong>Item costs:</strong> ${itemPrice.toFixed(2)}
                </p>
                <div className="border-t-2 border-blue-200 mt-2 pt-2">
                  <p className="text-xl font-bold text-green-600">
                    <strong>Change:</strong> ${change.toFixed(2)}
                  </p>
                </div>
              </div>

              {change < 0 && (
                <div className="bg-red-100 border border-red-300 p-4 rounded-xl">
                  <p className="text-red-700 font-semibold">⚠️ Not enough money!</p>
                </div>
              )}

              <button
                onClick={resetScenario}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NumeracyChecklist() {
  const [checkedItems, setCheckedItems] = useState({});

  const skills = [
    { id: 1, text: "Recognises Australian coins and notes", icon: "🪙" },
    { id: 2, text: "Adds together different combinations", icon: "➕" },
    { id: 3, text: "Calculates change correctly", icon: "💰" },
    { id: 4, text: "Understands decimal notation", icon: "🔢" },
    { id: 5, text: "Can count money in real scenarios", icon: "🏪" },
  ];

  const toggleCheck = (id) => {
    setCheckedItems({ ...checkedItems, [id]: !checkedItems[id] });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">✅ Numeracy Skills Checklist</h3>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-bold text-green-600">
              {completedCount}/{skills.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / skills.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleCheck(skill.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                checkedItems[skill.id]
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{skill.icon}</span>
                <span className="flex-1 font-medium">{skill.text}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    checkedItems[skill.id]
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {checkedItems[skill.id] && "✓"}
                </div>
              </div>
            </button>
          ))}
        </div>

        {completedCount === skills.length && (
          <div className="mt-6 bg-green-500 text-white p-4 rounded-xl text-center font-bold animate-bounce">
            🎉 Congratulations! You&apos;ve mastered all numeracy skills!
          </div>
        )}
      </div>
    </div>
  );
}

export default function NumeracyCountingMoneyLesson() {
  const navigate = useNavigate();

  const objectives = [
    "Recognise Australian coins and notes",
    "Add together different combinations of notes",
    "Participate in practice activity using menu and prices",
    "Calculate change in buying scenarios",
    "Apply money skills in real-world contexts",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
            >
              <span className="text-xl">←</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">💰 Numeracy: Counting Money</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Learning Objectives */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Learning Objectives</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {objectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-700">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Activities */}
        <MoneyMatchingGame />
        <ShoppingListActivity />
        <RolePlayScenario />
        <NumeracyChecklist />

        {/* Completion Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 shadow-xl"
          >
            🎉 Complete Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
