import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api';

export default function ItemForm({ fetchItems, fetchCategories, categories, role }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [catName, setCatName] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

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
      toast.success('Item added');
      setName('');
      setQuantity('');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add item');
    }
  };

  const addCategory = async () => {
    if (!catName) {
      toast.error('Category name required');
      return;
    }

    try {
      await API.post('/categories', { name: catName }, { headers: { role } });
      toast.success('Category added');
      setCatName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Add Item */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">➕ Add New Item</h3>
        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item Name"
          />
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            min={0}
          />
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white font-medium py-2 rounded-md"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Add Category */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📂 Add New Category</h3>
        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Category Name"
          />
          <button
            onClick={addCategory}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 rounded-md"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}
