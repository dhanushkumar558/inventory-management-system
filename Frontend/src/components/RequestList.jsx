import { useEffect, useState } from 'react';
import API from '../api';
import * as XLSX from 'xlsx';
import Select from 'react-select';

export default function RequestList({ role }) {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exportType, setExportType] = useState('');

  // Fetch all categories
  useEffect(() => {
    API.get('/categories').then((res) => setCategories(res.data));
  }, []);

  // Fetch requests (optionally filtered by category)
  const fetchRequests = async (categoryId = '') => {
    const res = await API.get('/requests', {
      headers: { role },
      params: categoryId ? { category_id: categoryId } : {},
    });
    setRequests(res.data);
  };

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle category change
  const handleCategoryChange = (selected) => {
    setSelectedCategory(selected);
    fetchRequests(selected?.value || '');
  };

  const exportOptions = [
    { value: 'txt', label: 'TXT' },
    { value: 'excel', label: 'Excel' },
    { value: 'json', label: 'JSON' },
  ];

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

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  return (
    <div className="mt-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            📄 Employee Requests
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select
              className="text-sm w-40"
              placeholder="Filter"
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  borderColor: '#d1d5db',
                  padding: '2px 4px',
                  minHeight: '36px',
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#4ade80' },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  zIndex: 999,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                  color: '#111827',
                  fontSize: '0.875rem',
                  padding: '8px',
                }),
              }}
            />

            {/* Export Dropdown */}
            <Select
              className="text-sm w-30"
              options={exportOptions}
              placeholder="Export"
              value={exportOptions.find((opt) => opt.value === exportType)}
              onChange={(selected) => setExportType(selected.value)}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  borderColor: '#d1d5db',
                  padding: '2px 4px',
                  minHeight: '36px',
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#4ade80' },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  zIndex: 999,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                  color: '#111827',
                  fontSize: '0.875rem',
                  padding: '8px',
                }),
              }}
            />

            {/* Export Button */}
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
          <p className="text-gray-500 text-sm">No requests found.</p>
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
