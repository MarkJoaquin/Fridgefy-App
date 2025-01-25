import MyRecipeList from "./index";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { useEffect } from 'react';
import { fetchRecipes } from '../../features/recipes/recipeSlice';

const FullRecipeDetails: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    
    console.log("Recipe ID from URL:", id);
    
    const { recipes, loading } = useSelector((state: RootState) => state.recipes);
    console.log("ID desde URL:", id);
    console.log("Recetas desde el estado:", recipes);
    
    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;

   const currentRecipe = recipes.find((recipe) => recipe.id === Number(id));
   

    console.log("recipes from State:",recipes )
    console.log("Current Recipe:", currentRecipe )

    if (!currentRecipe) return <div>Recipe not found</div>;

    const instructions = currentRecipe.instructions 
        ? (Array.isArray(currentRecipe.instructions)
            ? currentRecipe.instructions
            : currentRecipe.instructions.split('\n'))
        : [];

    return (
        <div className="main-container">
            <div className="recipe-full-details">
                <div className="recipe-header">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h3>{currentRecipe.name}</h3>
                </div>
                
                <div className="recipe-content">
                    <div className="recipe-main-info">
                        <img src={currentRecipe.image} alt={currentRecipe.name} className="recipe-full-image" />
                        
                        <div className="recipe-quick-info">
                            <p><strong>Prep Time:</strong> {currentRecipe.prepTimeMinutes}</p>
                            <p><strong>Cook Time:</strong> {currentRecipe.cookTimeMinutes}</p>
                            <p><strong>Servings:</strong> {currentRecipe.servings}</p>
                            <p><strong>Difficulty:</strong> {currentRecipe.difficulty}</p>
                            <p><strong>Cuisine:</strong> {currentRecipe.cuisine}</p>
                            <p><strong>Calories:</strong> {currentRecipe.caloriesPerServing} per serving</p>
                        </div>
                    </div>

                    <div className="recipe-details">
                        <section className="recipe-ingredients">
                            <h2>Ingredients</h2>
                            <ul>
                            {Array.isArray(currentRecipe.ingredients) 
                                    ? currentRecipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))
                                    : currentRecipe.ingredients.split(',').map((ingredient, index) => (
                                        <li key={index}>{ingredient.trim()}</li>
                                    ))}
                            </ul>
                        </section>

                        <section className="recipe-instructions">
                            <h2>Instructions</h2>
                            <ol>
                                {instructions.map((step: string, index: number) => (
                                <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </section>

                        <section className="recipe-tags">
                            <h2>Tags</h2>
                            <div className="tags-container">
                            {Array.isArray(currentRecipe.tags) 
                                    ? currentRecipe.tags.map((tag: string, index: number) => (
                                          <span key={index} className="tag">{tag}</span>
                                      ))
                                    : typeof currentRecipe.tags === 'string' 
                                        ? currentRecipe.tags.split(',').map((tag: string, index: number) => (
                                          <span key={index} className="tag">{tag.trim()}</span>
                                      ))
                                        : null // Handle case where tags is neither an array nor a string
                                }
                            </div>
                        </section>

                        <section className="recipe-meal-type">
                            <h2>Meal Type</h2>
                            <p>{currentRecipe.mealType}</p>
                        </section>

                        <section className="recipe-rating">
                            <h2>Rating</h2>
                            <div className="rating-container">
                                <span className="rating-value">{currentRecipe.rating}/5</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <MyRecipeList /> 
        </div>
    );
};

export default FullRecipeDetails;