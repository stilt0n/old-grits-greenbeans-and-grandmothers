import { createRecipe, createAuthor, resetTables } from './operations';

const seedAuthors = async () => {
  const authorId = await createAuthor({
    name: 'grandmother_bot',
    bio: 'The site mascot for Grits, Greenbeans and Grandmothers',
  });
  return authorId;
};

const seedRecipes = async (authorId: number) => {
  await createRecipe({
    name: 'Grits',
    instructions: 'Make some grits',
    description: "Grandmother bot's take on a southern classic",
    authorId,
    recipeIngredients: [
      { name: 'grits', amount: 1, unit: 'cup' },
      { name: 'water', amount: 2, unit: 'cup' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'butter', amount: 1, unit: 'tbsp' },
    ],
  });

  await createRecipe({
    name: 'Greenbeans',
    instructions: 'Make some greenbeans',
    description: "Grandmother bot's favorite greenbeans",
    authorId,
    recipeIngredients: [
      { name: 'greenbeans', amount: 0.5, unit: 'lb' },
      { name: 'butter', amount: 1, unit: 'tbsp' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'pepper', amount: 0.5, unit: 'tsp' },
      { name: 'worcestshire sauce', amount: 2, unit: 'tsp' },
    ],
  });

  await createRecipe({
    name: 'Mashed Potatoes',
    instructions: 'Make some mashed potatoes',
    description: "Grandmother bot's mashed potatoes are so creamy you'll cry",
    authorId,
    recipeIngredients: [
      { name: 'potatoes', amount: 2, unit: 'lb' },
      { name: 'butter', amount: 0.5, unit: 'cup' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'pepper', amount: 0.5, unit: 'tsp' },
      { name: 'milk', amount: 0.5, unit: 'cup' },
    ],
  });
};

const seedDatabase = async () => {
  console.log('deleting old data from the database...');
  await resetTables();
  console.log('seeding database...');
  const userId = await seedAuthors();
  await seedRecipes(userId);
  console.log('finished seeding database');
};

await seedDatabase();
