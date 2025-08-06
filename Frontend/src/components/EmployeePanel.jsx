import { useEffect, useState } from 'react';
import API from '../api';
import ItemList from './ItemList';
import RequestList from './RequestList';
import Select from 'react-select';

export default function EmployeePanel({ user }) {
  const [action, setAction] = useState('add');
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('');
  const [time, setTime] = useState('');

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

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

  const requestItem = async (item_id, quantity, action = 'add') => {
  try {
    await API.post(
      '/requests',
      { item_id, quantity, action, username: user.username },
      { headers: { role: user.role } }
    );
   
  } catch {
    
  }
};

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-800">
            👤 Employee Panel 
            &nbsp;<span className="block sm:inline text-lg font-normal text-gray-500 ml-1">
              Welcome, <span className="font-medium text-green-600">{user.username}</span>
            </span>
          </h2>
          <div className="text-right text-sm text-gray-600 font-mono mt-4 sm:mt-0">
            🕒 Time: <span className="font-semibold">{time} IST</span>
          </div>
        </div>

      

        {/* Action Selection */}
       {/* Action Dropdown */}




        {/* Item List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Available Items</h3>
          <ItemList items={items} requestItem={requestItem} user={user} />
        </div>
      </div>
    </div>
  );
}
