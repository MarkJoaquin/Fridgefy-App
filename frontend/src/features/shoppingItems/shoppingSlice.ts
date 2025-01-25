import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface ShoppingItem {
  ingredient: string;
}

interface ShoppingState {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingState = {
  items: [],
  loading: false,
  error: null,
};

export const getShoppingList = createAsyncThunk(
  'shopping/getShoppingList',
  async (userEmail: string) => {
    const response = await fetch(
      `http://localhost:3000/getShoppingList?userEmail=${userEmail}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch shopping list');
    }
    const data = await response.json();
    return data.data;
  }
);

export const deleteShoppingItem = createAsyncThunk(
  'shopping/deleteShoppingItem',
  async ({ userEmail, ingredient }: { userEmail: string; ingredient: string }) => {
    const response = await fetch('http://localhost:3000/deleteShoppingItem', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail, ingredient }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete shopping item');
    }
    
    return ingredient;
  }
);

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Get Shopping List
      .addCase(getShoppingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShoppingList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shopping list';
      })
      // Delete Shopping Item
      .addCase(deleteShoppingItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShoppingItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          item => item.ingredient !== action.payload
        );
      })
      .addCase(deleteShoppingItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const selectShoppingList = (state: RootState) => state.shoppingItems;
export default shoppingSlice.reducer;