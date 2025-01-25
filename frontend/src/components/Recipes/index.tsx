import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipes,
  selectRecipes,
} from "../../features/recipes/recipeSlice";
import {
  saveRecipe,
  fetchSavedRecipes,
  selectSavedRecipes,
} from "../../features/savedRecipes/savedRecipesSlice";
import { AppDispatch } from "../../app/store";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { toast, Toaster } from "sonner";

const RecipesContainer = styled.div`
  
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
const RecipeList = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading, error } = useSelector(selectRecipes);
  const { savedRecipes, loading: saveLoading} = useSelector(selectSavedRecipes);
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  useEffect(() => {
    dispatch(fetchRecipes());
    if (userEmail) {
      dispatch(fetchSavedRecipes(userEmail));
    }
  }, [dispatch, userEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSaveRecipe = async (recipeData: {
    recipeId: string;
    userEmail: string;
  }) => {
    console.log("Saving recipe", recipeData);
    try {
      await dispatch(saveRecipe(recipeData)).unwrap();
      toast.success("Recipe saved successfully!");
    } catch (error: any) {
      console.error("Failed to save recipe", error.message);
      toast.error(error.message);
    }
  };

  console.log("Saved recipes", savedRecipes);

  return (
    <div style={ userEmail ? {gridArea: "recipes"} : {  }}>
      <RecipesContainer style={ { display: "flex", marginTop: "4rem"}}>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <img src={recipe.image} alt="pimage" />
            <h3>{recipe.name}</h3>
            <button
              onClick={() => {
                handleSaveRecipe({ recipeId: String(recipe.id), userEmail }).then(() => {
                  dispatch(fetchSavedRecipes(userEmail));
                });
              }}
              disabled={!userEmail || savedRecipes.map(savedRecipe => savedRecipe.recipeId).includes(String(recipe.id)) || saveLoading}
            >
              +
            </button>
          </div>
        ))}
      </RecipesContainer>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default RecipeList;
