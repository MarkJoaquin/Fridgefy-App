import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Toaster, toast } from "sonner";
import {
  fetchRecipes,
  selectRecipes,
} from "../../features/recipes/recipeSlice";
import {
  selectSavedRecipes,
  fetchSavedRecipes,
  deleteRecipe,
} from "../../features/savedRecipes/savedRecipesSlice";
import {
  selectSavedIngredients,
  getIngredients,
  saveIngredient,
} from "../../features/ingredients/ingredientsSlice";
import { getShoppingList } from "../../features/shoppingItems/shoppingSlice";
import { AppDispatch } from "../../app/store";

const ShoppingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  grid-area: shopping;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  details {
    width: 100%;
    background: white;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    summary {
      padding: 16px;
      cursor: pointer;
      position: relative;
      font-weight: 500;
      font-size: 18px;
      list-style: none;
      background: #f8f9fa;

      &::-webkit-details-marker {
        display: none;
      }

      &:after {
        content: "›";
        position: absolute;
        right: 20px;
        transform: rotate(90deg);
        font-size: 24px;
        transition: transform 0.2s;
      }
    }

    &[open] summary:after {
      transform: rotate(270deg);
    }

    img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      margin: 10px 0;
    }

    div {
      padding: 16px;

      h3 {
        font-size: 18px;
        margin-bottom: 12px;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;

          input[type="checkbox"] {
            margin-right: 12px;
          }
        }
      }
    }

    .button-group {
      display: flex;
      gap: 12px;
      padding: 16px;

      button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;

        &:nth-child(1) {
          background-color: #4285f4;
          color: white;
          &:hover {
            background-color: #3367d6;
          }
        }

        &:nth-child(2) {
          background-color: #34a853;
          color: white;
          &:hover {
            background-color: #2d8a46;
          }
        }

        &:nth-child(3) {
          background-color: #ff6b6b;
          color: white;
          &:hover {
            background-color: #ff5252;
          }
        }
      }
    }
  }
`;

type Recipe = {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

const ShoppingList = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { savedRecipes, loading } = useSelector(selectSavedRecipes);
  const { recipes } = useSelector(selectRecipes);
  const { ingredients } = useSelector(selectSavedIngredients);

  // console.log("Saved Recipes", savedRecipes);
  // console.log("Recipes from store", recipes);
  // console.log("Ingredients from user", ingredients);

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  console.log("ingredients", ingredients);

  const isIngredientSaved = (ingredient: string) => {
    return ingredients.some(
      (savedIngredient) => savedIngredient.ingredient === ingredient
    );
  };

  useEffect(() => {
    dispatch(fetchRecipes());
    if (userEmail) {
      dispatch(fetchSavedRecipes(userEmail));
      dispatch(getIngredients(userEmail));
    }
  }, [dispatch, userEmail]);

  const savedRecipeDetails = recipes.filter((recipe) =>
    savedRecipes
      .map((savedRecipe) => savedRecipe.recipeId)
      .includes(String(recipe.id))
  );

  console.log("Saved Recipe Details", savedRecipeDetails);

  const handleSaveIngredients = async (recipeId: string) => {
    try {
      const recipe = recipes.find((r) => String(r.id) === recipeId);
      if (!recipe || !recipe.ingredients) {
        toast.error("No ingredients found for this recipe");
        return;
      }

      await dispatch(
        saveIngredient({
          ingredients: recipe.ingredients,
          recipeId: recipeId,
          userEmail: userEmail,
        })
      ).unwrap();

      toast.success("Ingredients saved successfully");

      // Recargar los ingredientes
      if (userEmail) {
        dispatch(getIngredients(userEmail));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save ingredients"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userEmail) {
    return <div>Please sign in to view your shopping list</div>;
  }

  if (savedRecipeDetails.length === 0) {
    return <div>No recipes saved</div>;
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await dispatch(deleteRecipe({ recipeId, userEmail })).unwrap();
      toast.success("Recipe deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete recipe"
      );
    }
  };

  return (
    <>
      <div style={{ gridArea: "recipes" }}>
        <ShoppingListContainer>
          <h2>My Recipes</h2>
          {savedRecipeDetails.length > 0 ? (
            savedRecipeDetails
              .filter((recipe): recipe is Recipe => recipe !== undefined)
              .map((recipe) => (
                <details key={recipe.id}>
                  <summary>{recipe.name}</summary>
                  <img src={recipe.image} alt={recipe.name} />
                  <div>
                    <h3>Ingredients</h3>
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          <input
                            style={{ cursor: "not-allowed" }}
                            type="checkbox"
                            checked={isIngredientSaved(ingredient)}
                            readOnly
                          />
                          <span
                            style={{
                              textDecoration: isIngredientSaved(ingredient)
                                ? "line-through"
                                : "none",
                              color: isIngredientSaved(ingredient)
                                ? "#666"
                                : "inherit",
                            }}
                          >
                            {ingredient}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p
                      style={{
                        color: "#777",
                        paddingTop: "15px",
                        fontStyle: "italic",
                      }}
                    >
                      Note: Checkboxes indicate ingredients already in your fridge
                      and are read-only.
                    </p>
                  </div>
                  <div className="button-group">
                    <button>View Recipe</button>
                    <button
                      onClick={() => {
                        handleSaveIngredients(String(recipe.id)).then(() => {
                          dispatch(getShoppingList(userEmail));
                        });
                      }}
                    >
                      Add missing ingredients to Shopping List
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteRecipe(String(recipe.id)).then(() => {
                          dispatch(fetchSavedRecipes(userEmail));
                          dispatch(fetchRecipes());
                        });
                      }}
                    >
                      Remove Recipe
                    </button>
                    <Toaster position="bottom-right" richColors expand={true} />
                  </div>
                </details>
              ))
          ) : (
            <p>No recipes saved</p>
          )}
        </ShoppingListContainer>
      </div>
    </>
  );
};

export default ShoppingList;
