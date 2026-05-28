import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,

      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setLoading: (val) => set({ isLoading: val }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'agroerp-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
