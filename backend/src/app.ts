import express, { NextFunction, Request, Response } from "express";
import { CustomError } from "./errors/custom-error";
import  authRouter  from "./routers/authRoute";
import  recipeRouter  from "./routers/recipeRoute";
import  ingredientsRouter  from "./routers/ingredientsRouter";
import  shoppingListRoute  from "./routers/shoppingListRoute";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

// For Authentication
app.use('/saveDataUser', authRouter);

// For recipes
app.use('/saveRecipe', recipeRouter); 
app.use('/getSavedRecipes', recipeRouter);
app.use('/deleteRecipe', recipeRouter)

// For ingredients
app.use('/savedIngredients', ingredientsRouter )
app.use('/saveIngredient', ingredientsRouter)
app.use('/saveIndividualIngredient', ingredientsRouter)
app.use('/deleteIngredient', ingredientsRouter)

//For shopping list or Items to buy
app.use('/getShoppingList', shoppingListRoute)
app.use('/deleteShoppingItem', shoppingListRoute)

app.all("*", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: `Not Found Route - ${req.method} ${req.path}` });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json(error);
  }
});
