import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async () => {
    const response = await axios.get("https://dummyjson.com/recipes?limit=0"); // move to backend
    console.log("API Response:", response.data);
    return (response.data as { recipes: Recipe[] }).recipes;
  }
);

type Recipe = {
  id: string ;
  name: string;
  ingredients: string[] | string;
  instructions: string[] | string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags?: string[] | string;
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recipes";
      });
  },
});

// export const {} = recipeSlice.actions;
export const selectRecipes = (state: RootState) => state.recipes;
export default recipeSlice.reducer;
