import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { selectRecipes } from "../../features/recipes/recipeSlice";


const ShoppingListContainer = styled.div`
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

type UserRecipe = {
  recipeId: string;
};

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const { user } = useUser();

  const fetchRecipes = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/getRecipes?userEmail=${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      console.log("Data from backend", data.recipes);
      setRecipes(data.recipes);
      console.log("Recipes successfully fetched", recipes);
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const recipesFromStore = useSelector(selectRecipes);
  console.log("Recipes from store", recipesFromStore.recipes);

  const getIntersection = (
    recipes: UserRecipe[],
    recipesFromStore: Recipe[]
  ) => {
    const storeIds = new Set(
      recipesFromStore.map((recipe) => String(recipe.id))
    );
    const userRecipeIds = new Set(recipes.map((recipe) => recipe.recipeId));
    console.log("Store IDs", storeIds);
    console.log("Recipes", userRecipeIds);
    return Array.from(userRecipeIds).filter((id) => storeIds.has(id));
  };

  const recipesInCommon = getIntersection(recipes, recipesFromStore.recipes);

  console.log("Recipes In Common", recipesInCommon);

  const recipesToDisplay = recipesInCommon.map((recipeId) => {
    const recipe = recipesFromStore.recipes.find(
      (recipe) => String(recipe.id) === recipeId
    );
    return recipe;
  });

  console.log("Recipes to display", recipesToDisplay);

  return (
    <div>
      <h2>Recipes List</h2>
      <ShoppingListContainer>
        {recipesToDisplay.length > 0 ? (
          recipesToDisplay.map((recipe: Recipe | undefined) => (
            <details key={recipe!.id}>
              <summary>{recipe!.name}</summary>
              <img src={recipe!.image} alt={recipe!.name} />
              <div>
                <h3>Ingredients</h3>
                <ul>
                  {recipe!.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <input type="checkbox" disabled readOnly />
                      {ingredient}
                    </li>
                  ))}
                </ul>
                <p>
                  Note: Checkboxes indicate ingredients already in your fridge
                  and are read-only.
                </p>
              </div>
              <div className="button-group">
                <button>View Recipe</button>
                <button>Add missing ingredients to Shopping List</button>
                <button>Remove Recipe</button>
              </div>
            </details>
          ))
        ) : (
          <p>No recipes saved</p>
        )}
      </ShoppingListContainer>
    </div>
  );
};

export default RecipesList;
