import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api';
import Select from 'react-select';

export default function ItemForm({ fetchItems, fetchCategories, categories, role }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [catName, setCatName] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [viewCat, setViewCat] = useState();

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const addItem = async () => {
    if (!name || !selectedCat || quantity === '') {
      toast.error('Fill all fields');
      return;
    }

    try {
      await API.post(
        '/items',
        { name, category_id: selectedCat, quantity: parseInt(quantity) },
        { headers: { role } }
      );
      toast.success('✅ Item added');
      setName('');
      setQuantity('');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to add item');
    }
  };

  const addCategory = async () => {
    if (!catName) {
      toast.error('Category name required');
      return;
    }

    try {
      await API.post('/categories', { name: catName }, { headers: { role } });
      toast.success('✅ Category added');
      setCatName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to add category');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-6">
      {/* Category Section */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">📂 Add New Category</h3>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Enter Category Name"
          />
          <button
            onClick={addCategory}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            ➕ Add Category
          </button>

          <div className="pt-2 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🗃️ Available Categories</h3>
            <Select
              className="w-full pt-2 text-sm"
              placeholder="List Available Categories"
              options={categoryOptions}
              value={categoryOptions.find(opt => opt.value === viewCat) || null}
              onChange={(selected) => setViewCat(selected?.value)}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  borderColor: '#d1d5db',
                  padding: '2px',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#4ade80',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                  color: '#111827',
                  padding: '10px',
                  cursor: 'pointer',
                }),
              }}
            />
          </div>
        </div>
      </div>

      {/* Item Section */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">📦 Add New Item</h3>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Item Name"
          />
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter Quantity"
          />
          <Select
            className="w-full text-sm"
            placeholder=" Select Category for Item"
            options={categoryOptions}
            value={categoryOptions.find(opt => opt.value === selectedCat) || null}
            onChange={(selected) => setSelectedCat(selected?.value)}
            isClearable
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                borderColor: '#d1d5db',
                padding: '2px',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#4ade80',
                },
              }),
              menu: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                overflow: 'hidden',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? '#f0fdf4' : '#fff',
                color: '#111827',
                padding: '10px',
                cursor: 'pointer',
              }),
            }}
          />
          <button
            onClick={addItem}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
          >
            ➕ Add Item
          </button>
        </div>
      </div>
    </div>
  );
}
