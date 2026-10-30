import { vi } from "vitest";

type Result = { data: unknown; error: unknown };

/** Minimal stand-in for the Supabase query builder, recording selects and upserts. */
export function createFakeDb(tables: Record<string, Result> = {}) {
  const selects: { table: string; columns: string }[] = [];
  const upserts: { table: string; row: unknown }[] = [];

  const from = vi.fn((table: string) => {
    const result = tables[table] ?? { data: null, error: null };
    const query = {
      select: (columns: string) => {
        selects.push({ table, columns });
        return query;
      },
      eq: () => query,
      order: () => query,
      limit: () => query,
      single: async () => result,
      maybeSingle: async () => result,
      upsert: async (row: unknown) => {
        upserts.push({ table, row });
        return { data: null, error: null };
      },
      then: (resolve: (value: Result) => unknown) => Promise.resolve(result).then(resolve),
    };
    return query;
  });

  return { from, selects, upserts };
}
