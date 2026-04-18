import { create } from 'zustand';

// Attempt to parse existing user from localStorage safely
let initialUser = null;
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== 'undefined') {
    initialUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Failed to parse user from localStorage", error);
}

const useAuthStore = create((set) => ({
  user: initialUser,
  token: initialUser?.token || null,
  isAuthenticated: !!initialUser,
  
  login: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token: userData.token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token: userData.token });
  }
}));

export default useAuthStore;
