import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Toaster, toast } from "sonner";
import { AppDispatch } from "../../app/store";
import {
  saveIndividualIngredient,
  getIngredients,
} from "../../features/ingredients/ingredientsSlice";
import { useUser } from "@clerk/clerk-react";
import { fetchRecipes, selectRecipes } from "../../features/recipes/recipeSlice";
import { selectSavedIngredients, deleteIngredient } from "../../features/ingredients/ingredientsSlice";

const IngredientsManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { recipes } = useSelector(selectRecipes);
  const { ingredients } = useSelector(selectSavedIngredients);

  // Obtener todos los ingredientes únicos de las recetas
  const allRecipeIngredients = Array.from(
    new Set(recipes.flatMap((recipe) => recipe.ingredients))
  );

  // Filtrar sugerencias basadas en el input
  const suggestions = allRecipeIngredients.filter((ing) =>
    ing.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchRecipes());
      dispatch(getIngredients(userEmail));
    }
  }, [dispatch, userEmail]);

  const handleAddIngredient = async (ingredient: string) => {
    if (!userEmail) return;

    try {
      await dispatch(
        saveIndividualIngredient({
          userEmail,
          ingredient: ingredient,
        })
      ).unwrap();
      toast.success("Ingredient added successfully");
    } catch (error) {
      console.error("Failed to add ingredient", error);
      toast.error("Failed to add ingredient");
    }
  };

  const handleDeleteIngredient = async (ingredient: string) => {
    if (!userEmail) return;

    try {
      await dispatch(
        deleteIngredient({
          userEmail,
          ingredient,
        })
      ).unwrap();
      toast.success("Ingredient removed successfully");
    } catch (error) {
      console.error("Failed to remove ingredient", error);
      toast.error("Failed to remove ingredient");
    }
  };

  return (
    <Container>
      <h2>My Fridge</h2>

      <InputContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Add an ingredient..."
          onFocus={() => setShowSuggestions(true)}
        />

        {showSuggestions && inputValue && (
          <SuggestionsList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => {handleAddIngredient(suggestion).then(() => {
                    setInputValue("");
                    setShowSuggestions(false);
                    dispatch(getIngredients(String(userEmail)));
                })}}
              >
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
      </InputContainer>

      <IngredientsList>
        {ingredients.map((item, index) => (
          <IngredientItem key={index}>
            <span>{item.ingredient}</span>
            <DeleteButton
              onClick={() => {handleDeleteIngredient(item.ingredient).then(() => {
                dispatch(getIngredients(String(userEmail)));
              })}}
            >
              ×
            </DeleteButton>
          </IngredientItem>
        ))}
      </IngredientsList>

      <Toaster position="bottom-right" richColors  />
    </Container>
  );
};

const Container = styled.div`
  width: 20rem;
  margin: 0 auto;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);


  h2 {
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
  }
  grid-area: fridge;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
  }

  span {
    color: #333;
    font-size: 16px;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

export default IngredientsManager;
