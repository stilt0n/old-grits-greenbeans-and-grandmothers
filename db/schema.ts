import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// TODO: I'm not sure if (hashed and salted) passwords will be stored here
// or if they will be handled by a third-party auth provider. This may need
// to be refactored in the future.
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const authors = sqliteTable('authors', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  bio: text('bio'),
});

export type InsertAuthor = typeof authors.$inferInsert;
export type SelectAuthor = typeof authors.$inferSelect;

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  instructions: text('instructions').notNull(),
  // TODO: cascade on delete probably doesn't make sense here, but I will figure out the correct behavior later
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  authorId: integer('author_id')
    .notNull()
    .references(() => authors.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertRecipe = typeof recipes.$inferInsert;
export type SelectRecipe = typeof recipes.$inferSelect;

export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount'),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type InsertIngredient = typeof ingredients.$inferInsert;
export type SelectIngredient = typeof ingredients.$inferSelect;
