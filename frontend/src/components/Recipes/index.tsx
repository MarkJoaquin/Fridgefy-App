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
import "./Recipes.css";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import RecipeDetail from "./RecipeDetail";
import { Recipe } from "../../../../backend/src/utilities/fetchRecipes";



const RecipeList = () => {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, loading, error } = useSelector(selectRecipes);
  const { savedRecipes, loading: saveLoading } =
    useSelector(selectSavedRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const [filterText, setFilterText] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  const [selectedRatingRange, setSelectedRatingRange] = useState<string>("");
  const [selectedPrepTime, setSelectedPrepTime] = useState<string>("");

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

  const handleDetailsClick = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    ("Details button clicked for recipe:", recipe);
    setSelectedRecipe(recipe);
  };

  const handleSaveRecipe = async (recipeData: {
    recipeId: string;
    userEmail: string;
  }) => {
    ("Saving recipe", recipeData);
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

  ("Saved recipes", savedRecipes);

  const filteredRecipes = recipes.filter((recipe) => {
    const recipeRating = recipe.rating ? Number(recipe.rating) : 0;

    return (
      recipe.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (selectedTag ? recipe.tags?.includes(selectedTag) : true) &&
      (selectedMealType ? recipe.mealType.includes(selectedMealType) : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true) &&
      (selectedRatingRange
        ? selectedRatingRange === "lessThan3"
          ? recipeRating < 3
          : selectedRatingRange === "4to4.2"
          ? recipeRating >= 4 && recipeRating < 4.2
          : selectedRatingRange === "4.2to4.4"
          ? recipeRating >= 4.2 && recipeRating < 4.4
          : selectedRatingRange === "4.4to4.6"
          ? recipeRating >= 4.4 && recipeRating < 4.6
          : selectedRatingRange === "4.6to4.8"
          ? recipeRating >= 4.6 && recipeRating < 4.8
          : selectedRatingRange === "4.8to5"
          ? recipeRating >= 4.8 && recipeRating <= 5
          : true
        : true) &&
      (selectedPrepTime
        ? recipe.prepTimeMinutes === Number(selectedPrepTime)
        : true)
    );
  });

  const uniqueTags = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.tags || []))
  );
  const uniqueMealTypes = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.mealType || []))
  );
  const uniqueCuisines = Array.from(
    new Set(recipes.map((recipe) => recipe.cuisine))
  );

  return (
    <div style={userEmail ? { gridArea: "recipes" } : {}}>
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
            <select
              id="tag-select"
              onChange={(e) => setSelectedTag(e.target.value)}
              value={selectedTag}
              className="filter-dropdown"
            >
              <option value="">All Tags</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="meal-type-select">Meal Types</label>
            <select
              id="meal-type-select"
              onChange={(e) => setSelectedMealType(e.target.value)}
              value={selectedMealType}
              className="filter-dropdown"
            >
              <option value="">All Meal Types</option>
              {uniqueMealTypes.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {mealType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cuisine-select">Cuisines</label>
            <select
              id="cuisine-select"
              onChange={(e) => setSelectedCuisine(e.target.value)}
              value={selectedCuisine}
              className="filter-dropdown"
            >
              <option value="">All Cuisines</option>
              {uniqueCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rating-select">Rating</label>
            <select
              id="rating-select"
              onChange={(e) => setSelectedRatingRange(e.target.value)}
              value={selectedRatingRange}
              className="filter-dropdown"
            >
              <option value="">All Ratings</option>
              <option value="4to4.2">4 - 4.2</option>
              <option value="4.2to4.4">4.2 - 4.4</option>
              <option value="4.4to4.6">4.4 - 4.6</option>
              <option value="4.6to4.8">4.6 - 4.8</option>
              <option value="4.8to5">4.8 - 5</option>
            </select>
          </div>

          <div>
            <label htmlFor="prep-time-select">Prep Time</label>
            <select
              id="prep-time-select"
              onChange={(e) => setSelectedPrepTime(e.target.value)}
              value={selectedPrepTime}
              className="filter-dropdown"
            >
              <option value="">All Prep Times</option>
              <option value="15">Under 15 mins</option>
              <option value="30">Under 30 mins</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className={`recipes-container ${
          userEmail ? "gridArea: recipes" : "recipes-container"
        }`}
      >
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
              disabled={!userEmail}
            >
              Details
            </button>
            <button
              className="save-button"
              onClick={() => {
                handleSaveRecipe({
                  recipeId: String(recipe.id),
                  userEmail,
                }).then(() => {
                  dispatch(fetchSavedRecipes(userEmail));
                });
              }}
              disabled={
                !userEmail ||
                savedRecipes
                  .map((savedRecipe) => savedRecipe.recipeId)
                  .includes(String(recipe.id)) ||
                saveLoading
              }
            >
              +
            </button>
          </div>
        ))}
        {selectedRecipe && (
          <RecipeDetail recipe={selectedRecipe} onClose={closeDetails} />
        )}
      </div>
    </div>
  );
};

export default RecipeList;
