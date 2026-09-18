function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
}

function snakeToCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnakeCaseKey(key: string): string {
  return camelToSnake(key);
}

export function fromSnakeCaseKey(key: string): string {
  return snakeToCamel(key);
}

export function toSnake<T extends object>(data: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data) as string[]) {
    out[camelToSnake(key)] = (data as Record<string, unknown>)[key];
  }
  return out;
}

export function fromSnake<T extends object>(data: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data) as string[]) {
    out[snakeToCamel(key)] = (data as Record<string, unknown>)[key];
  }
  return out;
}

export function fromSnakeAs<T extends object>(data: T): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(data) as string[]) {
    out[snakeToCamel(key)] = (data as Record<string, unknown>)[key];
  }
  return out as T;
}
