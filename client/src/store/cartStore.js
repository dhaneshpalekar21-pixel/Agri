import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  customer: null,
  discount: 0,
  paymentType: 'cash',

  setCustomer: (customer) => set({ customer }),
  setPaymentType: (type) => set({ paymentType: type }),
  setDiscount: (discount) => set({ discount }),

  addItem: (product) => {
    const items = get().items
    const existing = items.find((i) => i._id === product._id)
    if (existing) {
      set({
        items: items.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        ),
      })
    } else {
      set({ items: [...items, { ...product, qty: 1 }] })
    }
  },

  removeItem: (id) =>
    set({ items: get().items.filter((i) => i._id !== id) }),

  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i._id !== id) })
    } else {
      set({ items: get().items.map((i) => (i._id === id ? { ...i, qty } : i)) })
    }
  },

  clearCart: () => set({ items: [], customer: null, discount: 0, paymentType: 'cash' }),

  subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
  gstAmount: () => {
    const sub = get().subtotal()
    return Math.round(sub * 0.18 * 100) / 100
  },
  total: () => {
    const sub = get().subtotal()
    const gst = get().gstAmount()
    const disc = get().discount
    return Math.round((sub + gst - disc) * 100) / 100
  },
}))
