import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../features/recipes/recipeSlice";
import savedRecipesReducer from "../features/savedRecipes/savedRecipesSlice";
import ingredientsReducer from "../features/ingredients/ingredientsSlice";
import shoppingReducer from "../features/shoppingItems/shoppingSlice";

const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    savedRecipes: savedRecipesReducer,
    ingredients: ingredientsReducer,
    shoppingItems: shoppingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
