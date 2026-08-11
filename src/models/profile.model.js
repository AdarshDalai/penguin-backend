const { pgTable, pgSchema, uuid, text, timestamp } = require('drizzle-orm/pg-core');

// External auth.users table definition for foreign key reference
const authSchema = pgSchema('auth');
const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  email: text('email'),
  display_name: text('display_name'),
  avatar_url: text('avatar_url'),
  phone: text('phone'),
  bio: text('bio'),
  website: text('website'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

module.exports = {
  profiles,
};
