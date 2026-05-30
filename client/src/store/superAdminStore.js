import { create } from 'zustand'

export const useSuperAdminStore = create((set) => ({
  activeCategory: 'Dashboard',
  activeSubItem: 'Overview',
  searchQuery: '',
  theme: 'light',
  
  setActiveItem: (category, subItem) => set({ activeCategory: category, activeSubItem: subItem }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  })
}))
