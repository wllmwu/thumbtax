import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import "@testing-library/jest-dom/vitest";

class InMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new InMemoryStorage(),
  configurable: true,
  writable: true,
});

beforeEach(() => {
  globalThis.localStorage = new InMemoryStorage();
});

afterEach(cleanup);
