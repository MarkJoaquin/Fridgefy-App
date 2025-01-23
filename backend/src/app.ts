import express, { NextFunction, Request, Response } from "express";
import { CustomError } from "./errors/custom-error";
import  authRouter  from "./routers/authRoute";
import  recipeRouter  from "./routers/recipeRoute";
import cors from "cors";
import { removeRecipe } from "./controllers/removeController";
import fridgeRouter from "./routers/fridgeRoute";

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use('/saveDataUser', authRouter);
app.use('/saveRecipe', recipeRouter); 
app.use('/getRecipes', recipeRouter);

app.use('/removeRecipe', removeRecipe);

app.use('/myFridge', fridgeRouter);
app.use('/myFridge/post', fridgeRouter);
app.use('/myFridge/get', fridgeRouter);
app.use('/myFridge/delete', fridgeRouter);




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
