import { describe, expect, it } from "vitest";
import { Stack } from "./02-stack";

describe("2 Stack", () => {
  it("ist am Anfang leer", () => {
    const stack = new Stack<number>();
    expect(stack.size).toBe(0);
    expect(stack.isEmpty()).toBe(true);
    expect(stack.pop()).toBeUndefined();
    expect(stack.peek()).toBeUndefined();
  });

  it("arbeitet nach dem LIFO-Prinzip", () => {
    const stack = new Stack<string>();
    stack.push("a");
    stack.push("b", "c");
    expect(stack.size).toBe(3);
    expect(stack.peek()).toBe("c");
    expect(stack.pop()).toBe("c");
    expect(stack.pop()).toBe("b");
    expect(stack.size).toBe(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it("übernimmt Startwerte aus beliebigen Iterables", () => {
    expect(new Stack([1, 2, 3]).peek()).toBe(3);
    expect(new Stack(new Set(["x", "y"])).toArray()).toEqual(["x", "y"]);
    expect(new Stack("abc").pop()).toBe("c"); // ein String ist auch iterierbar!
  });

  it("liefert mit toArray eine Kopie von unten nach oben", () => {
    const stack = new Stack([1, 2]);
    const array = stack.toArray();
    array.push(99);
    expect(stack.toArray()).toEqual([1, 2]);
  });

  it("verändert die Startwerte nicht", () => {
    const initial = [1, 2, 3];
    const stack = new Stack(initial);
    stack.pop();
    stack.push(4);
    expect(initial).toEqual([1, 2, 3]);
  });

  it("ist von oben nach unten iterierbar", () => {
    const stack = new Stack([1, 2, 3]);
    const seen: number[] = [];
    for (const item of stack) {
      seen.push(item);
    }
    expect(seen).toEqual([3, 2, 1]);
    expect([...stack]).toEqual([3, 2, 1]);
    expect(stack.size).toBe(3); // Iterieren verändert den Stack nicht
  });

  it("kann gemappt werden", () => {
    const numbers = new Stack([1, 2, 3]);
    const labels = numbers.map((n) => `#${n}`);
    expect(labels).toBeInstanceOf(Stack);
    expect(labels.toArray()).toEqual(["#1", "#2", "#3"]);
    expect(labels.peek()).toBe("#3");
    expect(numbers.toArray()).toEqual([1, 2, 3]);
  });

  it("versteckt den internen Speicher", () => {
    const stack = new Stack([1]);
    expect(Object.keys(stack)).toEqual([]);
  });
});
