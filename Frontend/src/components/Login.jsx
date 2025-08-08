import { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(true); // Show modal when page loads
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill both fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/login', { username, password });
      onLogin(res.data);
      toast.success("Login successful");
    } catch (err) {
      console.log("Login error:", err);
      const msg = err.response?.data?.error || 'Login failed. Invalid credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            
            {/* Cross Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">📢 Login Info</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="font-semibold">Admin Login</p>
                <p>Username: <span className="font-mono">ADMIN-CHN-53</span></p>
                <p>Password: <span className="font-mono">adminpass</span></p>
              </div>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="font-semibold">Employee/User Login</p>
                <p>Username: <span className="font-mono">EMP-CHN-53</span></p>
                <p>Password: <span className="font-mono">emppass</span></p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-xl w-full max-w-sm p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">🔐 Welcome Back</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
