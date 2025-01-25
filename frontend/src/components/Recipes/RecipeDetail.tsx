import { useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';

interface RecipeProps {
    recipe: any;
    onClose: () => void;
}

const RecipeDetail: React.FC<RecipeProps> = ({ recipe, onClose }) => {

    const navigate = useNavigate();
    const handleViewFullRecipeDetails = () => {
        onClose(); 
        navigate(`/recipe/${recipe.id}`);
    }


    if (!recipe) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div>
                <button  
                onClick={onClose} 
                style={{
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#333'
                }}
                >
                <FaTimes size={20} />
            </button>

                </div>

                <h2>{recipe.name}</h2>
                <img className="image-Detail" src={recipe.image} alt={recipe.name} />
                <p>Dificulty: {recipe.difficulty}</p>
                <p> Cousine: {recipe.cuisine}</p>
                <p>Calories: {recipe.caloriesPerServing}</p>
                <button 
                    className="full-details-button" 
                    onClick={handleViewFullRecipeDetails}
                >
                    View full Details
                </button>
            </div>
        </div>
    );
};

export default RecipeDetail;

