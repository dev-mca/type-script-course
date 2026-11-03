// Lösung Aufgabe 3 – Eine Zustandsmaschine mit Discriminated Unions

export type Item = { product: string; quantity: number; priceInRappen: number };

export type DraftOrder = { status: "draft"; id: string; items: Item[] };
export type SubmittedOrder = {
  status: "submitted";
  id: string;
  items: Item[];
  submittedAt: string;
};
export type ShippedOrder = {
  status: "shipped";
  id: string;
  items: Item[];
  submittedAt: string;
  trackingNumber: string;
};
export type CancelledOrder = { status: "cancelled"; id: string; reason: string };

export type Order = DraftOrder | SubmittedOrder | ShippedOrder | CancelledOrder;

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// Kleine Helfer machen den Code unten lesbarer
const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = <T>(error: string): Result<T> => ({ ok: false, error });

export function submit(order: Order, now: string): Result<SubmittedOrder> {
  if (order.status !== "draft") {
    return fail(`Bestellung ${order.id} kann nicht abgeschickt werden (Status: ${order.status})`);
  }
  // Ab hier: order ist DraftOrder
  if (order.items.length === 0) {
    return fail("Bestellung ist leer");
  }
  return ok({ ...order, status: "submitted", submittedAt: now });
}

export function ship(order: Order, trackingNumber: string): Result<ShippedOrder> {
  if (order.status !== "submitted") {
    return fail(`Bestellung ${order.id} kann nicht versendet werden (Status: ${order.status})`);
  }
  if (trackingNumber.trim() === "") {
    return fail("Trackingnummer fehlt");
  }
  return ok({ ...order, status: "shipped", trackingNumber });
}

export function cancel(order: Order, reason: string): Result<CancelledOrder> {
  if (order.status === "shipped" || order.status === "cancelled") {
    return fail(`Bestellung ${order.id} kann nicht storniert werden (Status: ${order.status})`);
  }
  // Bewusst kein Spread: Ein CancelledOrder hat keine items mehr
  return ok({ status: "cancelled", id: order.id, reason });
}

export function orderTotal(order: Order): number {
  if (order.status === "cancelled") {
    return 0;
  }
  // Hier: draft | submitted | shipped – alle haben items
  let total = 0;
  for (const item of order.items) {
    total += item.quantity * item.priceInRappen;
  }
  return total;
}

export function statusLabel(order: Order): string {
  switch (order.status) {
    case "draft":
      return `Entwurf (${order.items.length} Artikel)`;
    case "submitted":
      return `Bestellt am ${order.submittedAt.slice(0, 10)}`;
    case "shipped":
      return `Versendet (Tracking: ${order.trackingNumber})`;
    case "cancelled":
      return `Storniert: ${order.reason}`;
  }
}
