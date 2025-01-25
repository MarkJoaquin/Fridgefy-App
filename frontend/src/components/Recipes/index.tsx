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
import './Recipes.css';
// import { RecipesContainer } from './Recipes';
import { useUser } from "@clerk/clerk-react";
import { toast, Toaster } from "sonner";

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
      <div className={`recipes-container ${userEmail ? "gridArea: recipes" : "recipes-container"}`}>
        {recipes.map((recipe) => (
          <section key={recipe.id}>
            <div className="img-container">
              <img src={recipe.image} alt="pimage" />  
            </div>
            <h3>{recipe.name}</h3>
            <button className="view-button">View Recipe</button>
            <button
            className="save-button"
              onClick={() => {
                handleSaveRecipe({ recipeId: String(recipe.id), userEmail }).then(() => {
                  dispatch(fetchSavedRecipes(userEmail));
                });
              }}
              disabled={!userEmail || savedRecipes.map(savedRecipe => savedRecipe.recipeId).includes(String(recipe.id)) || saveLoading}
            >
              +
            </button>
          </section>
        ))}
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default RecipeList;
