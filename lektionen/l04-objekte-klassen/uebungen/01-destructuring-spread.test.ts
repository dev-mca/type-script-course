import { describe, expect, it } from "vitest";
import {
  addTag,
  getCity,
  moveToCity,
  swap,
  toPublicUser,
  type User,
  withDefaults,
} from "./01-destructuring-spread";

function createUser(): User {
  return {
    id: 1,
    name: "Melih",
    email: "melih@example.ch",
    password: "geheim123",
    address: { street: "Bahnhofstrasse 1", city: "Aarau" },
    tags: ["stammkunde"],
  };
}

describe("1.1 swap", () => {
  it("vertauscht die Werte", () => {
    expect(swap([1, "a"])).toEqual(["a", 1]);
    expect(swap([true, null])).toEqual([null, true]);
  });

  it("verändert das Original nicht", () => {
    const pair: [number, number] = [1, 2];
    swap(pair);
    expect(pair).toEqual([1, 2]);
  });
});

describe("1.2 withDefaults", () => {
  it("ergänzt fehlende Werte", () => {
    expect(withDefaults({ theme: "dark" })).toEqual({
      theme: "dark",
      language: "de",
      notifications: true,
    });
    expect(withDefaults({})).toEqual({ theme: "light", language: "de", notifications: true });
  });

  it("übernimmt false und alle angegebenen Werte", () => {
    expect(withDefaults({ notifications: false, language: "fr" })).toEqual({
      theme: "light",
      language: "fr",
      notifications: false,
    });
  });

  it("liefert ein neues Objekt (nicht DEFAULT_SETTINGS selbst)", () => {
    const result = withDefaults({});
    result.theme = "dark";
    expect(withDefaults({}).theme).toBe("light");
  });

  it("★ ignoriert ausdrücklich undefined gesetzte Werte", () => {
    expect(withDefaults({ theme: undefined }).theme).toBe("light");
  });
});

describe("1.3 toPublicUser", () => {
  it("entfernt das Passwort", () => {
    const result = toPublicUser(createUser());
    expect(result).not.toHaveProperty("password");
    expect(result).toEqual({
      id: 1,
      name: "Melih",
      email: "melih@example.ch",
      address: { street: "Bahnhofstrasse 1", city: "Aarau" },
      tags: ["stammkunde"],
    });
  });

  it("verändert das Original nicht", () => {
    const user = createUser();
    toPublicUser(user);
    expect(user.password).toBe("geheim123");
  });
});

describe("1.4 getCity", () => {
  it("liefert die Stadt", () => {
    expect(getCity(createUser())).toBe("Aarau");
  });

  it("liefert 'unbekannt' ohne Adresse", () => {
    const { address, ...withoutAddress } = createUser();
    expect(getCity(withoutAddress)).toBe("unbekannt");
  });
});

describe("1.5 moveToCity", () => {
  it("ändert nur die Stadt", () => {
    const moved = moveToCity(createUser(), "Baden");
    expect(moved.address).toEqual({ street: "Bahnhofstrasse 1", city: "Baden" });
    expect(moved.name).toBe("Melih");
  });

  it("verändert weder den Benutzer noch seine Adresse", () => {
    const user = createUser();
    const originalAddress = user.address;
    const moved = moveToCity(user, "Baden");
    expect(user.address?.city).toBe("Aarau");
    expect(user.address).toBe(originalAddress);
    expect(moved).not.toBe(user);
    expect(moved.address).not.toBe(originalAddress);
  });

  it("legt eine Adresse an, wenn keine vorhanden ist", () => {
    const { address, ...withoutAddress } = createUser();
    expect(moveToCity(withoutAddress, "Wohlen").address).toEqual({ street: "", city: "Wohlen" });
  });
});

describe("1.6 addTag", () => {
  it("fügt ein neues Tag hinzu, ohne das Original zu ändern", () => {
    const user = createUser();
    const tagged = addTag(user, "vip");
    expect(tagged.tags).toEqual(["stammkunde", "vip"]);
    expect(user.tags).toEqual(["stammkunde"]);
    expect(tagged.tags).not.toBe(user.tags);
  });

  it("gibt bei vorhandenem Tag das Original zurück", () => {
    const user = createUser();
    expect(addTag(user, "stammkunde")).toBe(user);
  });
});
