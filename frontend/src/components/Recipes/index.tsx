import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipes,
  selectRecipes,
} from "../../features/recipes/recipeSlice";
import { AppDispatch } from "../../app/store";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";

const RecipesContainer = styled.div`
  display: flex;
  
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 80vh;


  div {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 300px;
    text-align: center;

    img {
      max-width: 100%;
      height: auto;
    }

    h3 {
      margin: 0;
    }

    button {
      color: #141414;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

const saveRecipe = async (recipeData: {
  recipeId: string;
  userEmail: string;
}) => {
  /* console.log("Save recipe with id", recipeData.recipeId);
    console.log("User email", recipeData.userEmail); */
  try {
    const response = await fetch("http://localhost:3000/saveRecipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      console.warn(
        "Failed to save recipe to the database, Recipe probably already exists"
      );
    }
    
    // change for a better message
    console.log(`Recipe ${recipeData.recipeId} saved successfully`);

  } catch (error) {
    console.log("Error saving recipe:", error);
  }
};

const RecipeList = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading, error } = useSelector(selectRecipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Recipes</h2>
      <RecipesContainer>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <img src={recipe.image} alt="pimage" />
            <h3>{recipe.name}</h3>
            <button
              onClick={() =>
                saveRecipe({
                  recipeId: String(recipe.id),
                  userEmail: user?.primaryEmailAddress?.emailAddress || "",
                })
              }
              disabled={!user?.primaryEmailAddress?.emailAddress}
            >
              Save Recipe
            </button>
          </div>
        ))}
      </RecipesContainer>
    </div>
  );
};

export default RecipeList;
