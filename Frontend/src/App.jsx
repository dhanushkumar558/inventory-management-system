import { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import EmployeePanel from './components/EmployeePanel';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      {user.role === 'admin' && <AdminPanel user={user} />}
      {user.role === 'employee' && <EmployeePanel user={user} />}
    </div>
  );
}
