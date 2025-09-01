import React, { useState } from 'react';

const QnAForum = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load questions");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!newQuestion.trim()) {
      setError("Please enter a question.");
      return;
    }
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newQuestion }),
      });
      if (res.ok) {
        setSuccess("Question posted.");
        setQuestions([...questions, { id: Date.now(), text: newQuestion }]);
        setNewQuestion("");
      } else {
        setError("Failed to post question.");
      }
    } catch (err) {
      setError("Error posting question.");
    }
  };

  return (
    <div className="qna-forum mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Q&A Forum</h2>
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="mr-2 px-2 py-1 border rounded"
        />
        <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded">Post</button>
      </form>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <ul>
        {questions.length === 0 && !loading && !error ? (
          <li>No questions yet</li>
        ) : (
          questions.map((q) => (
            <li key={q.id} className="py-1">{q.text}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default QnAForum;
