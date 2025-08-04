import { useEffect, useState } from 'react';
import API from '../api';

export default function RequestList({ role }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get('/requests', { headers: { role } }).then((res) => setRequests(res.data));
  }, []);

  return (
    <div className="mt-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📄 Employee Requests
        </h3>

        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((req) => (
              <li
                key={req.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
              >
                <div className="text-gray-700">
                  <span className="font-medium">{req.username}</span> requested
                  <span className="font-semibold text-blue-600 mx-1">{req.item}</span>
                  <span className="text-gray-500">(Qty: {req.quantity})</span>
                </div>
                <span className="text-sm text-gray-400">#ID: {req.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
