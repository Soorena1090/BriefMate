import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar, jsonb,  } from "drizzle-orm/pg-core";

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

export const briefs = pgTable(
    'briefs',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
        content: text('content').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex('briefs_project_id_unique').on(table.projectId),
    ],
);


export const analyses = pgTable(
    'analyses',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
        briefId: uuid('brief_id').notNull().references(() => briefs.id, { onDelete: 'cascade' }),
        summary: text('summary').notNull(),
        requirements: jsonb('requirements').notNull(),
        questions: jsonb('questions').notNull(),
        model: varchar('model', { length: 100 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        index('analyses_project_id_idx').on(table.projectId),
        index('analyses_brief_id_idx').on(table.briefId),
    ]
);

export const schema = {
    users,
    projects,
    briefs,
    analyses,
};