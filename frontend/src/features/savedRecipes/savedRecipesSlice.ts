import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface SavedRecipe {
  recipeId: string;
  userEmail: string;
}

interface SavedRecipesState {
  savedRecipes: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedRecipesState = {
  savedRecipes: [],
  loading: false,
  error: null,
};

export const saveRecipe = createAsyncThunk(
  "recipes/saveRecipe",
  async (recipeData: SavedRecipe) => {
    const response = await fetch("http://localhost:3000/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return recipeData.recipeId;
  }
);

export const fetchSavedRecipes = createAsyncThunk(
  "savedRecipes/fetchSavedRecipes",
  async (userEmail: string) => {
    const response = await fetch(
      `http://localhost:3000/getSavedRecipes?userEmail=${userEmail}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch saved recipes");
    }
    const data = await response.json();
    return data.recipes;
  }
);

export const deleteRecipe = createAsyncThunk(
  "savedRecipes/deleteRecipe",
  async (recipeData: SavedRecipe) => {
    const response = await fetch("http://localhost:3000/deleteRecipe", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  }
);

const savedRecipesSlice = createSlice({
  name: "savedRecipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Save Recipe
      .addCase(saveRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes.push(action.payload);
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to save recipe";
      })
      // Fetch Saved Recipes
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch saved recipes";
      });
  },
});

export const selectSavedRecipes = (state: RootState) => state.savedRecipes;
export default savedRecipesSlice.reducer;
