"use client";
import { useEffect } from "react";
import { useCartStore } from "@/globalStates/shop";

export function CartInitializer({ count }: { count: number }) {
  const setCount = useCartStore((s) => s.setCount);
  useEffect(() => {
    setCount(count);

    console.log("INISLAJZER cart count:", count);
  }, [count, setCount]);
  return null;
}
