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

        {/* Action Selection */}
       {/* Action Dropdown */}
<div className="bg-white shadow-md rounded-xl p-6">
  <label className="block mb-2 text-sm font-medium text-gray-700">Select Action</label>
  <Select
    className="w-60 text-sm"
    options={[
      { value: 'add', label: 'Add Stock' },
      { value: 'reduce', label: 'Reduce Stock' },
    ]}
    value={{ value: action, label: action === 'add' ? 'Add Stock' : 'Reduce Stock' }}
    onChange={(selectedOption) => setAction(selectedOption.value)}
    styles={{
      control: (base) => ({
        ...base,
        borderRadius: '0.375rem',
        borderColor: '#d1d5db',
        boxShadow: 'none',
        padding: '2px 4px',
        minHeight: '40px',
        fontSize: '0.875rem',
        '&:hover': {
          borderColor: '#4ade80',
        },
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
        color: '#111827',
        fontSize: '0.875rem',
        padding: '8px 12px',
      }),
    }}
  />
</div>


        {/* Category Filter */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filter by Category
          </label>
          <Select
            className="w-60 text-sm"
            options={categoryOptions}
            value={categoryOptions.find((opt) => opt.value === selected)}
            onChange={(selectedOption) => setSelected(selectedOption.value)}
            isSearchable
            styles={{
              control: (base, state) => ({
                ...base,
                borderRadius: '0.375rem',
                borderColor: state.isFocused ? '#4ade80' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 2px #bbf7d0' : 'none',
                padding: '2px 4px',
                minHeight: '40px',
                fontSize: '0.875rem',
                '&:hover': {
                  borderColor: '#4ade80',
                },
              }),
              menu: (base) => ({
                ...base,
                zIndex: 999,
                borderRadius: '0.375rem',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                color: '#111827',
                fontSize: '0.875rem',
                padding: '8px 12px',
              }),
            }}
          />
        </div>

        {/* Item List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📦 Available Items</h3>
          <ItemList items={items} requestItem={requestItem} user={user} />
        </div>
      </div>
    </div>
  );
}
