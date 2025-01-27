
import { Router } from "express";
import { getShoppingList, deleteShoppingItem } from "../controllers/shoppingList";

const router = Router();    

router.get("/", getShoppingList);
router.delete("/", deleteShoppingItem);
export default router;