import { createRecipe, createUser } from './operations';

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
    createdBy: userId,
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
    createdBy: userId,
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
    createdBy: userId,
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
  console.log('seeding database...');
  const userId = await seedUsers();
  await seedRecipes(userId);
  console.log('finished seeding database');
};

await seedDatabase();
