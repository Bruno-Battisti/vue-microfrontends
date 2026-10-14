/**
 * Cliente de API mock compartilhado. Simula uma API REST com latência de rede e
 * persistência em localStorage, para que cada microfrontend consuma dados por um
 * contrato único em vez de depender de estado interno de outro módulo.
 * Trocar por um client HTTP real (fetch/axios) exigiria apenas reimplementar este arquivo —
 * os módulos consumidores não mudam.
 */

const LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

function readStore<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as T[];
}

function writeStore<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createRestResource<T extends { id: string }>(storageKey: string, seed: T[]) {
  return {
    async list(): Promise<T[]> {
      return delay(readStore(storageKey, seed));
    },
    async get(id: string): Promise<T> {
      const items = readStore(storageKey, seed);
      const found = items.find((item) => item.id === id);
      if (!found) throw new ApiError(`Registro ${id} não encontrado`, 404);
      return delay(found);
    },
    async create(payload: Omit<T, 'id'>): Promise<T> {
      const items = readStore(storageKey, seed);
      const created = { ...payload, id: crypto.randomUUID() } as T;
      items.push(created);
      writeStore(storageKey, items);
      return delay(created);
    },
    async update(id: string, payload: Partial<T>): Promise<T> {
      const items = readStore(storageKey, seed);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new ApiError(`Registro ${id} não encontrado`, 404);
      items[index] = { ...items[index], ...payload };
      writeStore(storageKey, items);
      return delay(items[index]);
    },
    async remove(id: string): Promise<void> {
      const items = readStore(storageKey, seed);
      const next = items.filter((item) => item.id !== id);
      writeStore(storageKey, next);
      return delay(undefined);
    },
  };
}
