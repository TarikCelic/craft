import { create } from "zustand";

type MessagesStore = {
  count: number;
  setCount: (n: number) => void;
};

export const useMessagesStore = create<MessagesStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));
