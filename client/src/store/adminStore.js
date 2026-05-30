import { create } from 'zustand'

export const useAdminStore = create((set) => ({
  activeCategory: 'Dashboard',
  activeSubItem: 'Overview',
  searchQuery: '',
  
  setActiveItem: (category, subItem) => set({ activeCategory: category, activeSubItem: subItem }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
