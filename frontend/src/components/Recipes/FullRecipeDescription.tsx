import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { useEffect } from 'react';
import { fetchRecipes } from '../../features/recipes/recipeSlice';
import "./FullRecipeDetails.css"

const FullRecipeDetails: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    ("Recipe ID from URL:", id);  

    const { recipes, loading, error } = useSelector((state: RootState) => state.recipes);

    ("Recetas desde el estado:", recipes);

    useEffect(() => {
        
        if (recipes.length === 0) {
            ("No recipes found in state, fetching...");
            dispatch(fetchRecipes());
        } else {
            ("Recipes already loaded.");
        }
    }, [dispatch, recipes.length]);

   
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading recipes: {error}</div>;

    if (!recipes || recipes.length === 0) return <div>No recipes available</div>;

    const recipeId = Number(id);

    const currentRecipe = recipes.find((recipe) => recipe.id === recipeId);

    ("Current recipe:", currentRecipe);  

    if (!currentRecipe) {
        return <div>Recipe not found for ID {id}</div>; 
    }

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
                            <p><strong>Prep Time:</strong> {currentRecipe.prepTimeMinutes} minutes</p>
                            <p><strong>Cook Time:</strong> {currentRecipe.cookTimeMinutes} minutes</p>
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
                                        : null
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
                                <span className="rating-value">{currentRecipe.rating}/5 ({currentRecipe.reviewCount} reviews)</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullRecipeDetails;
