import { OrderStatus } from "@/app/generated/prisma";

export const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

export function getAllowedTransitions(current: OrderStatus): OrderStatus[] {
  if (current === "CANCELLED" || current === "DELIVERED") return [];

  const currentIndex = STATUS_ORDER.indexOf(current);
  const canCancel = currentIndex < STATUS_ORDER.indexOf("SHIPPED");
  const nextStatus = STATUS_ORDER[currentIndex + 1] as OrderStatus | undefined;

  const transitions: OrderStatus[] = [];
  if (nextStatus) transitions.push(nextStatus);
  if (canCancel) transitions.push("CANCELLED");

  return transitions;
}
