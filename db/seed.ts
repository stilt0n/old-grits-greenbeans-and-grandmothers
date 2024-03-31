import { createRecipe, createUser, resetTables } from './operations';

const seedUsers = async () => {
  const userId = await createUser({
    name: 'grandmother_bot',
    email: 'grandmother@botmail.com',
  });
  return userId;
};

const seedRecipes = async (userId: number) => {
  await createRecipe({
    name: 'Grits',
    instructions: 'Make some grits',
    description: "Grandmother bot's take on a southern classic",
    createdBy: userId,
    author: 'grandmother_bot',
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
    createdBy: userId,
    author: 'grandmother_bot',
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
    createdBy: userId,
    author: 'grandmother_bot',
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
  const userId = await seedUsers();
  await seedRecipes(userId);
  console.log('finished seeding database');
};

await seedDatabase();
