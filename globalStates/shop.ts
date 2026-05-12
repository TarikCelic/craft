import { create } from "zustand";

interface CartStore {
  count: number;
  setCount: (n: number) => void;
  increment: (by?: number) => void;
  decrement: (by?: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  count: 0,
  setCount: (n) => set({ count: n }),
  increment: (by = 1) => set((s) => ({ count: s.count + by })),
  decrement: (by = 1) => set((s) => ({ count: s.count - by })),
}));
