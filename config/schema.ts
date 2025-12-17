import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const sessionChatTable = pgTable("session-chat", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session-id", { length: 255 }).notNull(),
  notes: text(),
  selectedDoctor: jsonb("selected-doctor").notNull(),
  conversation: jsonb(),
  report: jsonb(),
  createdBy: varchar("created-by", { length: 255 })
    .notNull()
    .references(() => usersTable.email),
  createdOn: timestamp("created-on", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});
