
export interface Recipe {
    id: string ;
    name: string;
    ingredients: string[] | string;
    instructions: string[] | string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: "Easy" | "Medium" | "Hard";
    cuisine: string;
    caloriesPerServing: number;
    tags?: string[] | string;
    userId: number;
    image: string;
    rating: number;
    reviewCount: number;
    mealType: string[];
  };
export const fetchRecipes = async () => {
  const response = await fetch("https://dummyjson.com/recipes?limit=0");
  const data = await response.json();
  return (data as { recipes: Recipe[] }).recipes;
};
