// Placeholder schema so `drizzle.config.ts` (schema: "./lib/db/schema.ts")
// resolves correctly. SakuraKeys/Keythm's typing test itself is fully
// client-side and doesn't require a database - this file is here so the
// Drizzle tooling you already had configured keeps working if/when you
// add persisted features (accounts, saved results, leaderboards, etc).
//
// Example of how a future table could look:
//
// import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
//
// export const results = sqliteTable("results", {
//   id: text("id").primaryKey(),
//   wpm: integer("wpm").notNull(),
//   accuracy: integer("accuracy").notNull(),
//   createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
// });

export {};
