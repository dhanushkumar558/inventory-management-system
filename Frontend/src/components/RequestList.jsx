import { useEffect, useState } from 'react';
import API from '../api';
import * as XLSX from 'xlsx';

export default function RequestList({ role }) {
  const [requests, setRequests] = useState([]);
  const [exportType, setExportType] = useState('');

  useEffect(() => {
    API.get('/requests', { headers: { role } }).then((res) => setRequests(res.data));
  }, []);

  const handleExport = () => {
    if (exportType === 'txt') {
      const header = 'ID,Item Name,Username,Quantity';
      const rows = requests.map(
        (req) => `${req.id},${req.item},${req.username},${req.quantity}`
      );
      const content = [header, ...rows].join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'requests.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportType === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(requests);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
      XLSX.writeFile(workbook, 'requests.xlsx');
    } else if (exportType === 'json') {
      // Export only selected fields for consistency
      const jsonData = requests.map((req) => ({
        id: req.id,
        item: req.item,
        username: req.username,
        quantity: req.quantity,
      }));
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: 'application/json',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'requests.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="mt-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            📄 Employee Requests
          </h3>

          <div className="flex items-center gap-2">
            <label htmlFor="exportType" className="text-sm text-gray-600 font-medium">
              Export as:
            </label>
            <select
              id="exportType"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="border text-sm rounded px-2 py-1"
            >
              <option value="">Choose</option>
              <option value="txt">TXT</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={handleExport}
              disabled={!exportType}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
            >
              Export
            </button>
          </div>
        </div>

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
