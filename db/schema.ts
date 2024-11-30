import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey().unique(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});
