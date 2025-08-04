import { useEffect, useState } from 'react';
import API from '../api';
import ItemList from './ItemList';
import RequestList from './RequestList';


export default function EmployeePanel({ user }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');

  const fetchItems = async () => {
    const res = await API.get('/items', selected ? { params: { category_id: selected } } : {});
    setItems(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [selected]);

  const requestItem = async (item_id, quantity) => {

    try {
        await API.post(
            '/requests',
            { item_id, quantity, username: user.username },
            { headers: { role: user.role } }
          );
          
      alert('✅ Requested successfully!');
    } catch {
      alert('❌ Request failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">
            👤 Employee Panel
            <span className="block sm:inline text-lg font-normal text-gray-500 ml-1">
              Welcome, <span className="font-medium text-green-600">{user.username}</span>
            </span>
          </h2>
        </div>

        {/* Category Filter */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filter by Category
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Available Items</h3>
          <ItemList items={items} requestItem={requestItem} />
        </div>
      </div>
    </div>
  );
}
