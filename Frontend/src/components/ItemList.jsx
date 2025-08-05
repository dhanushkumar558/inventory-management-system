import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api';

export default function ItemList({ requestItem, role }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quantityInputs, setQuantityInputs] = useState({});
  const [stockEdits, setStockEdits] = useState({});

  const fetchItems = async () => {
    const endpoint =
      selectedCategory === 'all'
        ? '/items'
        : `/items?category_id=${selectedCategory}`;
    const res = await API.get(endpoint);
    setItems(res.data);
  };

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
    if (quantity < 1) {
      toast.error('Enter valid quantity');
      return;
    }
    requestItem(itemId, quantity);
    setQuantityInputs({ ...quantityInputs, [itemId]: '' });
    toast.success('Item requested');
  };

  const handleStockEditChange = (itemId, value) => {
    setStockEdits({ ...stockEdits, [itemId]: value });
  };

  const handleStockSave = async (itemId) => {
    const newQty = parseInt(stockEdits[itemId]);
    if (isNaN(newQty) || newQty < 0) {
      toast.error('Enter a valid stock quantity');
      return;
    }

    try {
      await API.patch(`/items/${itemId}`, { quantity: newQty }, {
        headers: { role },
      });
      toast.success('Quantity updated');
      fetchItems(); // refresh items
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleDelete = async (itemId) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    try {
      await API.delete(`/items/${itemId}`, {
        headers: { role },
      });
      toast.success('Item deleted');
      fetchItems(); // refresh
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete item');
    }
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

                {role === 'admin' ? (
                  <div className="mt-2">
                    <label className="text-sm text-gray-600">Stock Quantity:</label>
                    <input
                      type="number"
                      value={stockEdits[item.id] ?? item.quantity}
                      onChange={(e) => handleStockEditChange(item.id, e.target.value)}
                      className="mt-1 border rounded px-2 py-1 w-full text-sm"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleStockSave(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-1 px-3 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">Quantity in Stock: {item.quantity}</p>
                )}
              </div>

              {requestItem && role !== 'admin' && (
                <div className="mt-4 space-y-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-full border rounded-md px-2 py-1 text-sm"
                    value={quantityInputs[item.id] || ''}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
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
