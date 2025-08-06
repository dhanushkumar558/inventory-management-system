import { useEffect, useState } from 'react';
import API from '../api';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import RequestList from './RequestList';

export default function AdminPanel({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [time, setTime] = useState('');

  const fetchItems = async () => {
    const res = await API.get('/items');
    setItems(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // Live IST clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const formattedTime = istTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered items based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">
            👑 Admin Panel
            &nbsp;
            <span className="block sm:inline text-lg font-normal text-gray-500 ml-1">
              Welcome, <span className="font-medium text-blue-600">{user.username}</span>
            </span>
          </h2>

          {/* Time */}
          <div className="text-right text-sm text-gray-600 font-mono mt-4 sm:mt-0">
            🕒 Time: <span className="font-semibold">{time} IST</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <ItemForm
          fetchCategories={fetchCategories}
            fetchItems={fetchItems}
            
            categories={categories}
            role={user.role}
          />
        </div>

     

        {/* Item List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Inventory Items</h3>
                {/* Search bar */}
                <input
          type="text"
          className="outline-none border-none focus:ring-0 px-2 py-1 text-sm mb-3 bg-transparent"

          placeholder="Search items by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          <ItemList role={user.role} items={filteredItems} fetchItems={fetchItems} />
        </div>

     

        {/* Request List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📩 Item Requests</h3>
          <RequestList role={user.role} />
          
        </div>
      </div>
    </div>
  );
}
