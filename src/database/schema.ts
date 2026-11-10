import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),

    email: varchar('email', {
        length:255,
    }).notNull().unique(),

    passwordHash: varchar('password_hash', {
        length:255,
    }).notNull(),

    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).defaultNow().notNull(),
});

export const projects = pgTable(
    'projects',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
        title: varchar('title', { length: 150 }).notNull(),
        description: text('description'),
        status: varchar('status', { length: 30 }).notNull().default('draft'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        index('projects_user_id_idx').on(table.userId),
    ],
);

export const schema = {
    users,
    projects,
};