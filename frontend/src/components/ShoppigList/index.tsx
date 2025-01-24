import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { selectRecipes } from "../../features/recipes/recipeSlice";

const ShoppingListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

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

type Ingredient = {
  ingredient: string;
};

const ShoppingList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState([]);
  const { user } = useUser();

  const recipesFromStore = useSelector(selectRecipes);
  console.log("Recipes from store", recipesFromStore.recipes);

  const fetchIngredients = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/getIngredients?userEmail=${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log("Response", response);
        throw new Error("Failed to fetch ingredients");
      }

      const data = await response.json();
      console.log("Ingredients from backend", data.ingredients);
      setIngredients(data.ingredients);
    } catch (error) {
      console.log("Error fetching ingredients:", error);
    }
  };

  const saveIngredient = async (ingredients: string[], recipeId: string) => {

    console.log("Ingredients to save", ingredients);
    console.log("Recipe ID", recipeId);

    const recipe = recipesFromStore.recipes.find((r) => r.id === recipeId);

    console.log("Recipe", recipe?.ingredients);

    const ingredientsToSave = recipe?.ingredients.filter(
      (ingredient) =>
        !ingredients
          .map((i) => i.toLowerCase().trim())
          .includes(ingredient.toLowerCase().trim())
    );

    console.log("Ingredients to save", ingredientsToSave);
    
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/saveIngredient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, ingredientsToSave }),
      });

      if (!response.ok) {
        throw new Error("Failed to save ingredients");
      }
    } catch (error) {
      console.log("Error saving ingredienst:", error);
    } 

  };

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
    } catch (error) {
      console.log("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);



  const recipesInCommon = Array.from(
    new Set(recipes.map((item: UserRecipe) => item.recipeId))
  );

  console.log("Recipes In Common", recipesInCommon);

  const recipesToDisplay = recipesInCommon.map((recipeId) => {
    const recipe = recipesFromStore.recipes.find(
      (recipe) => String(recipe.id) === recipeId
    );
    return recipe;
  });

  console.log("Recipes to display", recipesToDisplay);

  /* Ingredients to send */



  /*  Ingredients to send  */

  console.log("Ingredients", ingredients);

  return (
    <div>
      <h2>Shopping List</h2>
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
                      <input
                        style={{ cursor: "not-allowed" }}
                        type="checkbox"
                        checked={ingredients
                          .map((i) =>
                            typeof i === "string"
                              ? i.toLowerCase().trim()
                              : i.ingredient.toLowerCase().trim()
                          )
                          .includes(ingredient.toLowerCase().trim())}
                        readOnly
                      />
                      {ingredient}
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
                <button onClick={() => saveIngredient(ingredients.map((ingredient) => ingredient.ingredient), recipe!.id)}>Add missing ingredients to Shopping List</button>
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

export default ShoppingList;
