import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DUMMY_EMAIL = 'admin@yopmail.com';
const DUMMY_PASSWORD = '12345';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email, password) => {
        if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
          set({ isAuthenticated: true, user: { email, name: 'Admin' } });
          return true;
        }
        return false;
      },
      // Used by the invite flow: marks the user as authenticated without
      // requiring dummy credentials.
      inviteLogin: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        localStorage.removeItem("userRole");
        set({ isAuthenticated: false, user: null });
      },
    }),
    { name: 'auth-storage' }
  )
);
