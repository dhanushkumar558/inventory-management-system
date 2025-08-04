import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Inventory System</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">👋 Hello, {user.username}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
