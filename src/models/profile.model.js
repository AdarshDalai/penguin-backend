const { pgTable, pgSchema, uuid, text, timestamp, primaryKey, unique, pgPolicy } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

// External auth.users table definition for foreign key reference
const authSchema = pgSchema('auth');
const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    handle: text('handle').notNull(),
    email: text('email'),
    display_name: text('display_name'),
    avatar_url: text('avatar_url'),
    phone: text('phone'),
    bio: text('bio'),
    website: text('website'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.handle] }),
    unique('profiles_handle_unique').on(table.handle),
    unique('profiles_email_unique').on(table.email),
    pgPolicy('Public profiles are viewable by everyone', {
      for: 'select',
      to: 'public',
      using: sql`true`,
    }),
    pgPolicy('Users can insert their own profile', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`(select auth.uid()) = id`,
    }),
    pgPolicy('Users can update their own profile', {
      for: 'update',
      to: 'authenticated',
      using: sql`(select auth.uid()) = id`,
      withCheck: sql`(select auth.uid()) = id`,
    }),
    pgPolicy('Users can delete their own profile', {
      for: 'delete',
      to: 'authenticated',
      using: sql`(select auth.uid()) = id`,
    }),
  ]
).enableRLS();

module.exports = {
  profiles,
};
