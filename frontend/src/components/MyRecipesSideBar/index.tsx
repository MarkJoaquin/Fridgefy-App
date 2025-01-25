import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavedRecipes,
} from "../../features/savedRecipes/savedRecipesSlice";
import { useUser } from "@clerk/clerk-react";
import { AppDispatch } from "../../app/store";
import { selectSavedRecipes } from "../../features/savedRecipes/savedRecipesSlice";
import { selectRecipes } from "../../features/recipes/recipeSlice";
import styled from "styled-components";
import { Link } from "react-router-dom";

const MyRecipesSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { savedRecipes } = useSelector(selectSavedRecipes);
  const { recipes } = useSelector(selectRecipes);

  const savedRecipesDetails = recipes.filter((recipe) =>
    savedRecipes.map((savedRecipe) => savedRecipe.recipeId).includes(String(recipe.id))
  );

  console.log("savedRecipesDetails", savedRecipesDetails);

  useEffect(() => {
    dispatch(fetchSavedRecipes(String(userEmail)));
  }, [dispatch, userEmail]);

  return (
    <SideBarContainer>
      <Title>My Recipes</Title>
      <RecipeList>
        {savedRecipesDetails.map((recipe) => (
          <Link to={`/shopping-list`} style={{ textDecoration: 'none' }}>
            <RecipeItem>
              <RecipeImage src={recipe.image} alt={recipe.name} />
              <RecipeTitle>{recipe.name}</RecipeTitle>
            </RecipeItem>
          </Link>
        ))}
      </RecipeList>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 20vw;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
`;

const RecipeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RecipeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const RecipeImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
`;

const RecipeTitle = styled.h3`
  font-size: 14px;
  color: #444;
  margin: 0;
`;
export default MyRecipesSideBar;
