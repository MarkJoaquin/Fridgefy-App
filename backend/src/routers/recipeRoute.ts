import { Router } from "express";
import { saveRecipe, getRecipes } from "../controllers/recipeController";
import { removeRecipe } from "../controllers/removeController";
import { myFridgeAdd } from "../controllers/myFridgeAdd";

const router = Router();

router.post("/", saveRecipe);
router.get("/", getRecipes);
router.delete("/remove", removeRecipe);
router.post("/myFridge", myFridgeAdd);

export default router;