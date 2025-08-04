import { useEffect, useState } from 'react';
import API from '../api';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import RequestList from './RequestList';

export default function AdminPanel({ user }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">
            👑 Admin Panel
            <span className="block sm:inline text-lg font-normal text-gray-500 ml-1">
              Welcome, <span className="font-medium text-blue-600">{user.username}</span>
            </span>
          </h2>
        </div>

        {/* Section: Add Item & Category */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <ItemForm
            fetchItems={fetchItems}
            fetchCategories={fetchCategories}
            categories={categories}
            role={user.role}
          />
        </div>

        {/* Section: Item List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Inventory Items</h3>
          <ItemList items={items} />
        </div>

        {/* Section: Requests */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📩 Item Requests</h3>
          <RequestList role={user.role} />
        </div>
      </div>
    </div>
  );
}
