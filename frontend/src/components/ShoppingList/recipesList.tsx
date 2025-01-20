import { useState, useEffect } from 'react';
import './shoppingList.css';

const RecipesList = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
    const [showInstructions, setShowInstructions] = useState<number | null>(null);

    useEffect(() => {
        fetch('https://dummyjson.com/recipes')
            .then(res => res.json())
            .then(data => setRecipes(data.recipes));
    }, []);

    const handleRecipeClick = (recipe: any) => {
        setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe);
    };

    return (
        <div>
            <h1>Recipes List</h1>
            <div className="recipes-grid">
                {recipes.map(recipe => (
                    <div 
                        key={recipe.id} 
                        className="recipe-card" 
                        onClick={() => handleRecipeClick(recipe)}
                    >
                        <div className="recipe-info">
                            <h3 className="recipe-title">{recipe.name}</h3>
                            <p>{recipe.cuisine}</p>
                            {selectedRecipe?.id === recipe.id && (
                                <div className="recipe-ingredients">
                                    <h4>Ingredientes:</h4>
                                    <ul>
                                        {recipe.ingredients.map((ingredient: string, index: number) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                    <button 
                                        className="instructions-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowInstructions(showInstructions === recipe.id ? null : recipe.id);
                                        }}
                                    >
                                        {showInstructions === recipe.id ? 'Ocultar Instrucciones' : 'Ver Instrucciones'}
                                    </button>
                                    {showInstructions === recipe.id && (
                                        <div className="recipe-instructions">
                                            <h4>Instrucciones:</h4>
                                            <p>{recipe.instructions}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <img 
                            src={recipe.image} 
                            alt={recipe.name} 
                            width={100} 
                            height={100} 
                            className="recipe-image"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipesList; 