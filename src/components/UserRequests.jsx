import React, { useEffect, useState } from "react";

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load user requests");
        setLoading(false);
      });
  }, []);

  const handleApprove = (id) => {
    // Call API to approve user
  };

  const handleReject = (id) => {
    // Call API to reject user
  };

  return (
    <div className="user-requests mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Pending User Requests</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Role</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={3}>No pending requests</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-2 py-1">{req.name}</td>
                  <td className="px-2 py-1">{req.role}</td>
                  <td className="px-2 py-1">
                    <button onClick={() => handleApprove(req.id)} className="mr-2 text-green-600">
                      Approve
                    </button>
                    <button onClick={() => handleReject(req.id)} className="text-red-600">
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserRequests;
