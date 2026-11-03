// Aufgabe 4 – Ein generischer Cache mit Ablaufzeit
// Tests: npm run test:watch -- l07-generics/uebungen/04
//
// Ein Cache, dessen Einträge nach einer bestimmten Zeit (TTL = time to live) ablaufen.
// So etwas brauchst du z. B., um API-Antworten kurz zwischenzuspeichern.
//
// Wichtiges Design-Prinzip: Die Uhr wird INJIZIERT (Dependency Injection).
// Statt im Code direkt Date.now() aufzurufen, bekommt der Cache eine Funktion
// `now: () => number`. Im echten Einsatz ist das Date.now, im Test eine
// künstliche Uhr, die wir beliebig vorstellen können – ohne zu warten!

export type CacheOptions = {
  /** Lebensdauer eines Eintrags in Millisekunden */
  ttlMs: number;
  /** Aktuelle Zeit in Millisekunden. Standard: Date.now */
  now?: () => number;
};

/**
 * Anforderungen an TtlCache<K, V>:
 * - constructor(options: CacheOptions)  → ttlMs muss > 0 sein, sonst Error
 * - set(key, value): void               → speichert mit Ablaufzeit now() + ttlMs
 *                                          (überschreibt einen alten Eintrag)
 * - get(key): V | undefined             → undefined, wenn nicht vorhanden oder abgelaufen
 * - has(key): boolean                   → false, wenn abgelaufen
 * - delete(key): boolean                → true, wenn etwas entfernt wurde
 * - get size(): number                  → Anzahl NICHT abgelaufener Einträge
 * - getOrCompute(key, compute: () => V): V
 *     → liefert den gespeicherten Wert, oder ruft compute auf, speichert und liefert das Ergebnis
 *
 * Ein Eintrag ist abgelaufen, sobald now() >= Ablaufzeit.
 * Abgelaufene Einträge dürfen beim Zugriff entfernt werden (Aufräumen nebenbei).
 *
 * Tipp: Intern eine Map<K, { value: V; expiresAt: number }>
 */
export class TtlCache<K, V> {
  constructor(options: CacheOptions) {
    throw new Error("TODO: Aufgabe 4");
  }
}
