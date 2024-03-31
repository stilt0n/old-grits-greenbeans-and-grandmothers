import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// TODO: I'm not sure if (hashed and salted) passwords will be stored here
// or if they will be handled by a third-party auth provider. This may need
// to be refactored in the future.
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
  author: text('author'),
  imageUrl: text('image_url'),
  // TODO: cascade on delete probably doesn't make sense here, but I will figure out the correct behavior later
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const recipeRelations = relations(recipes, ({ one, many }) => ({
  ingredients: many(ingredients),
  user: one(users),
}));

export type InsertRecipe = typeof recipes.$inferInsert;
export type SelectRecipe = typeof recipes.$inferSelect;

export const ingredients = sqliteTable('ingredients', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount'),
  // splitting unit and amount allows for
  // recipe scaling to be automated
  unit: text('unit'),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const ingredientRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes),
}));

export type InsertIngredient = typeof ingredients.$inferInsert;
export type SelectIngredient = typeof ingredients.$inferSelect;
