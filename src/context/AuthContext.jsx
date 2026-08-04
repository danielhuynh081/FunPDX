import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    const initialUsers = [
      { username: 'admin', password: 'admin', role: 'admin' },
      { username: 'user', password: 'user', role: 'user' }
    ];
    if (!savedUsers) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(savedUsers);
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    const newUser = { username, password, role: 'user' };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Auto-login after register
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
