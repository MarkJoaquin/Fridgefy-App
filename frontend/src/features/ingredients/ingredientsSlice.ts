import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type SavedIngredient = {
  ingredient: string;
  userEmail: string;
};
interface Ingredient {
  ingredient: string;
}

interface IngredientsState {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null,
};

export const getIngredients = createAsyncThunk(
  "ingredients/getIngredients",
  async (userEmail: string) => {
    const response = await fetch(
      `http://localhost:3000/savedIngredients?userEmail=${userEmail}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch ingredients");
    }
    const data = await response.json();
    ("Ingredients from backend", data.ingredients);
    return data.ingredients;
  }
);

export const saveIngredient = createAsyncThunk(
  "ingredients/saveIngredient",
  async (ingredientData: {
    ingredients: string[];
    recipeId: string;
    userEmail: string;
  }) => {
    const response = await fetch("http://localhost:3000/saveIngredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: ingredientData.userEmail,
        ingredientsToSave: ingredientData.ingredients,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return ingredientData.ingredients;
  }
);

export const saveIndividualIngredient = createAsyncThunk(
  "ingredients/saveIndividualIngredient",
  async (ingredientData: SavedIngredient) => {
    const response = await fetch(
      "http://localhost:3000/saveIndividualIngredient/saveIndividualIngredient",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ingredientData),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return ingredientData.ingredient;
  }
);

export const deleteIngredient = createAsyncThunk(
  "ingredients/deleteIngredient",
  async ({ userEmail, ingredient }: { userEmail: string; ingredient: string }) => {
    const response = await fetch("http://localhost:3000/deleteIngredient", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail, ingredient }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return ingredient;
  }
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Ingredients
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ingredients";
      })
      // Save Ingredient
      .addCase(saveIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveIngredient.fulfilled, (state, action) => {
        state.loading = false;
        // Simplificado el manejo de ingredientes
        /* const newIngredients = action.payload.map((ingredient) => ({
          ingredient,
        }));
        state.ingredients = [...state.ingredients, ...newIngredients]; */
      })
      .addCase(saveIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to save ingredient";
      });
  },
});

export const selectSavedIngredients = (state: RootState) => state.ingredients;
export default ingredientsSlice.reducer;
