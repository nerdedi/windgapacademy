import React, { useState } from "react";

const AssignmentSubmission = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!file) {
      setError("Please select a file.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess("Assignment submitted successfully.");
      } else {
        setError("Failed to submit assignment.");
      }
    } catch (err) {
      setError("Error submitting assignment.");
    }
    setLoading(false);
  };

  return (
    <div className="assignment-submission mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Submit Assignment</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
          disabled={loading}
        >
          Submit
        </button>
      </form>
      {loading && <div className="text-gray-500">Submitting...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </div>
  );
};

export default AssignmentSubmission;
