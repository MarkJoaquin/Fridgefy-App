import { useEffect, useState } from "react";
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
import RecipeDetail from "./RecipeDetail";


const RecipeList = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading, error } = useSelector(selectRecipes);
  const { savedRecipes, loading: saveLoading} = useSelector(selectSavedRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const [filterText, setFilterText] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  

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

  
  const handleDetailsClick = (e: React.MouseEvent, recipe: any) => {
    e.stopPropagation();
    console.log("Details button clicked for recipe:", recipe);
    setSelectedRecipe(recipe);
};

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

  const closeDetails = () => {
    setSelectedRecipe(null);
  };

  console.log("Saved recipes", savedRecipes);

  const filteredRecipes = recipes.filter(recipe => {
    return (
      recipe.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (selectedTag ? recipe.tags?.includes(selectedTag) : true) &&
      (selectedMealType ? recipe.mealType.includes(selectedMealType) : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true)
    );
  });

  const uniqueTags = Array.from(new Set(recipes.flatMap(recipe => recipe.tags || [])));
  const uniqueMealTypes = Array.from(new Set(recipes.flatMap(recipe => recipe.mealType || [])));
  const uniqueCuisines = Array.from(new Set(recipes.map(recipe => recipe.cuisine)));

  return (
    <div style={ userEmail ? {gridArea: "recipes"} : {  }}>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search Recipes" 
          value={filterText} 
          onChange={(e) => setFilterText(e.target.value)} 
          className="filter-input"
        />
        <div className="filter-container">
          <div>
            <label htmlFor="tag-select">Tags</label>
            <select id="tag-select" onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag} className="filter-dropdown">
              <option value="">All Tags</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="meal-type-select">Meal Types</label>
            <select id="meal-type-select" onChange={(e) => setSelectedMealType(e.target.value)} value={selectedMealType} className="filter-dropdown">
              <option value="">All Meal Types</option>
              {uniqueMealTypes.map(mealType => (
                <option key={mealType} value={mealType}>{mealType}</option>
              ))}
            </select>  
          </div>
          
          <div>
            <label htmlFor="cuisine-select">Cuisines</label>
            <select id="cuisine-select" onChange={(e) => setSelectedCuisine(e.target.value)} value={selectedCuisine} className="filter-dropdown">
              <option value="">All Cuisines</option>
              {uniqueCuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>  
          </div>
        </div>
      </div>
      
      

      <div className={`recipes-container ${userEmail ? "gridArea: recipes" : "recipes-container"}`}>
        {filteredRecipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <div className="img-container">
              <img src={recipe.image} alt="pimage" />  
            </div>
            <div className="recipe-name">
              <h3>{recipe.name}</h3>
            </div>
            
            <button 
                className="view-button"
                onClick={(e) => handleDetailsClick(e, recipe)}
              >
                Details
            </button>
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
          </div>
        ))}
        {selectedRecipe && (
            <RecipeDetail 
                recipe={selectedRecipe} 
                onClose={closeDetails} 
            />
          )}
      <Toaster richColors position="bottom-right" />
    </div>
  </div>
  );
};

export default RecipeList;
