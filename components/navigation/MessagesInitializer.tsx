"use client";
import { useEffect } from "react";
import { useMessagesStore } from "@/globalStates/notifications";

export function MessagesInitializer({ count }: { count: number }) {
  const setCount = useMessagesStore((s) => s.setCount);
  useEffect(() => {
    setCount(count);
  }, [count, setCount]);
  return null;
}
