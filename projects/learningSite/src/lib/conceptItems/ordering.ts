import type { OrderingItem } from "@/schema";

export function gradeOrdering(item: OrderingItem, submittedOrder: string[]): { correct: boolean } {
  const correctOrder = [...item.entries]
    .sort((a, b) => a.correctPosition - b.correctPosition)
    .map((e) => e.id);

  const correct =
    submittedOrder.length === correctOrder.length &&
    submittedOrder.every((id, i) => id === correctOrder[i]);

  return { correct };
}
