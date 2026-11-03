import { describe, expect, it } from "vitest";
import {
  type DraftOrder,
  type Order,
  cancel,
  orderTotal,
  ship,
  statusLabel,
  submit,
} from "./03-bestellung";

const NOW = "2026-11-03T10:15:00Z";

function draft(): DraftOrder {
  return {
    status: "draft",
    id: "B-1",
    items: [
      { product: "Shampoo", quantity: 2, priceInRappen: 1500 },
      { product: "Kamm", quantity: 1, priceInRappen: 800 },
    ],
  };
}

/** Hilfsfunktion: Ergebnis auspacken oder Test fehlschlagen lassen */
function unwrap<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(`Erwartet ok, war Fehler: ${result.error}`);
  return result.value;
}

describe("3.1 submit", () => {
  it("schickt einen Entwurf ab", () => {
    const result = submit(draft(), NOW);
    expect(result).toEqual({
      ok: true,
      value: { status: "submitted", id: "B-1", items: draft().items, submittedAt: NOW },
    });
  });

  it("verändert die Eingabe nicht", () => {
    const order = draft();
    submit(order, NOW);
    expect(order.status).toBe("draft");
    expect(order).not.toHaveProperty("submittedAt");
  });

  it("lehnt leere Bestellungen ab", () => {
    const empty: Order = { status: "draft", id: "B-2", items: [] };
    expect(submit(empty, NOW)).toEqual({ ok: false, error: "Bestellung ist leer" });
  });

  it("lehnt bereits abgeschickte Bestellungen ab", () => {
    const submitted = unwrap(submit(draft(), NOW));
    expect(submit(submitted, NOW)).toEqual({
      ok: false,
      error: "Bestellung B-1 kann nicht abgeschickt werden (Status: submitted)",
    });
  });
});

describe("3.2 ship", () => {
  it("versendet eine abgeschickte Bestellung", () => {
    const submitted = unwrap(submit(draft(), NOW));
    const shipped = unwrap(ship(submitted, "CH123"));
    expect(shipped.status).toBe("shipped");
    expect(shipped.trackingNumber).toBe("CH123");
    expect(shipped.submittedAt).toBe(NOW);
    expect(shipped.items).toHaveLength(2);
  });

  it("lehnt Entwürfe ab", () => {
    expect(ship(draft(), "CH123").ok).toBe(false);
  });

  it("verlangt eine Trackingnummer", () => {
    const submitted = unwrap(submit(draft(), NOW));
    expect(ship(submitted, "  ").ok).toBe(false);
  });
});

describe("3.3 cancel", () => {
  it("storniert Entwürfe und abgeschickte Bestellungen", () => {
    expect(cancel(draft(), "Doppelt bestellt")).toEqual({
      ok: true,
      value: { status: "cancelled", id: "B-1", reason: "Doppelt bestellt" },
    });
    const submitted = unwrap(submit(draft(), NOW));
    expect(cancel(submitted, "Zu teuer").ok).toBe(true);
  });

  it("lehnt versendete und stornierte Bestellungen ab", () => {
    const shipped = unwrap(ship(unwrap(submit(draft(), NOW)), "CH123"));
    expect(cancel(shipped, "Zu spät").ok).toBe(false);
    const cancelled = unwrap(cancel(draft(), "x"));
    expect(cancel(cancelled, "nochmals").ok).toBe(false);
  });
});

describe("3.4 orderTotal", () => {
  it("summiert Menge × Preis", () => {
    expect(orderTotal(draft())).toBe(3800);
    expect(orderTotal(unwrap(submit(draft(), NOW)))).toBe(3800);
  });

  it("liefert 0 für stornierte Bestellungen", () => {
    expect(orderTotal(unwrap(cancel(draft(), "x")))).toBe(0);
  });
});

describe("3.5 statusLabel", () => {
  it("beschreibt jeden Zustand", () => {
    const submitted = unwrap(submit(draft(), NOW));
    const shipped = unwrap(ship(submitted, "CH123"));
    const cancelled = unwrap(cancel(draft(), "Kunde hat es sich anders überlegt"));

    expect(statusLabel(draft())).toBe("Entwurf (2 Artikel)");
    expect(statusLabel(submitted)).toBe("Bestellt am 2026-11-03");
    expect(statusLabel(shipped)).toBe("Versendet (Tracking: CH123)");
    expect(statusLabel(cancelled)).toBe("Storniert: Kunde hat es sich anders überlegt");
  });
});
