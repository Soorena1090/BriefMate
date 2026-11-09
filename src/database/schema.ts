import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),

    email: varchar('email', {
        length:255,
    }).notNull().unique(),

    passwordHash: varchar('password_hash', {
        length:255,
    }).notNull(),

    createdAt: timestamp('craeted_at', {
        withTimezone: true,
    }).defaultNow().notNull(),
});