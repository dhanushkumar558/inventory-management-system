import { useEffect, useState } from 'react';
import API from '../api';

export default function ItemList({ requestItem }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantityInputs, setQuantityInputs] = useState({}); // item.id -> quantity

  // Fetch all items (or by category)
  const fetchItems = async () => {
    const endpoint =
      selectedCategory === 'all'
        ? '/items'
        : `/items?category_id=${selectedCategory}`;
    const res = await API.get(endpoint);
    setItems(res.data);
  };

  // Fetch all categories for filter dropdown
  const fetchCategories = async () => {
    const res = await API.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const handleQuantityChange = (itemId, value) => {
    setQuantityInputs({ ...quantityInputs, [itemId]: value });
  };

  const handleRequest = (itemId) => {
    const quantity = parseInt(quantityInputs[itemId] || '1');
    if (quantity < 1) return alert('Enter valid quantity');
    requestItem(itemId, quantity); // call passed function with quantity
    setQuantityInputs({ ...quantityInputs, [itemId]: '' }); // reset
  };

  return (
    <div className="space-y-6">
      {/* Filter Dropdown */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
        <select
          className="border border-gray-300 p-2 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Show All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-gray-500 text-center py-10">🚫 No items available.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500">Category: {item.category_name}</p>
                <p className="text-sm text-gray-500">Quantity in Stock: {item.quantity}</p>
              </div>

              {requestItem && (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    value={quantityInputs[item.id] || ''}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                  <button
                    onClick={() => handleRequest(item.id)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 rounded-md transition duration-200"
                  >
                    🛒 Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
