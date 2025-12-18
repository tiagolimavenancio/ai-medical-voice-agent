import { pgTable, serial, varchar, text, json, timestamp, integer } from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  credits: integer("credits").notNull().default(0),
});

// Session Chat Table
export const SessionChatTable = pgTable("session-chat", {
  id: serial("id").primaryKey(),
  sessionid: varchar("session-id", { length: 255 }).notNull(),
  notes: text("notes"),
  selectedDoctor: json("selected-doctor").notNull(),
  conversation: json("conversation"),
  report: json("report"),
  createdBy: varchar("created-by", { length: 255 })
    .notNull()
    .references(() => usersTable.email),
  createdOn: timestamp("created-on", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
