import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import { fetchRecipes } from '../../features/recipes/recipeSlice';
import { RootState, AppDispatch } from '../../app/store'; // Asegúrate de importar `AppDispatch`
import "./RecipeDetails.css";

interface RecipeProps {
    recipe: any;
    onClose: () => void;
}

const RecipeDetail: React.FC<RecipeProps> = ({ recipe, onClose }) => {
    // Usa el tipo `AppDispatch` para dispatch
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Accede al estado global para obtener recetas y el estado de carga
    const { recipes, loading, error } = useSelector((state: RootState) => state.recipes);

    useEffect(() => {
        if (recipes.length === 0) {
            dispatch(fetchRecipes());
        }
    }, [dispatch, recipes.length]);

    const handleViewFullRecipeDetails = () => {
        onClose(); 
        navigate(`/recipe/${recipe.id}`);
    }

    if (!recipe) return null;

    // Muestra la pantalla de carga o el error si es necesario
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading recipes: {error}</div>;

    return (
        <div className="detail-modal-overlay">
            <div className="modal-content">
                
                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close details"
                >
                    <FaTimes size={20} />
                </button>
                <div className="info-container">
                    <h2>{recipe.name}</h2>
                    <img className="image-Detail" src={recipe.image} alt={recipe.name} />
                    <div className="details">
                        <p><strong>Difficulty:</strong>  {recipe.difficulty}</p>
                        <p><strong>Cuisine:</strong>  {recipe.cuisine}</p>
                        <p><strong>Calories:</strong> {recipe.caloriesPerServing}</p>
                    </div>
                
                    <button 
                        className="full-details-button" 
                        onClick={handleViewFullRecipeDetails}
                        aria-label={`View full details of ${recipe.name}`}
                    >
                        View full Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
