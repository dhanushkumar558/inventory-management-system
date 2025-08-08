import { useState } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';
import NavbarFirst from './NavbarFirst';


export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <>
<NavbarFirst />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-4xl w-full justify-center">
        
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

        {/* Side Info Box */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-800">📢 Login Info</h2>
          
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
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

      </div>
    </div>
  </>);
}
