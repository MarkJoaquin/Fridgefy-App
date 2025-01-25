import { useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';


import "./RecipeDetails.css"

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
        <div className="detail-modal-overlay">
            <div className="modal-content">
                <button  className="close-button"
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

                <h2>{recipe.name}</h2>
                <img className="image-Detail" src={recipe.image} alt={recipe.name} />
                <div className="details">
                <p><strong>Dificulty:</strong>  {recipe.difficulty}</p>
                <p><strong>Cousine:</strong>  {recipe.cuisine}</p>
                <p><strong>Calories:</strong> {recipe.caloriesPerServing}</p>
                </div>
                
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

