import { Router } from "express";
import { myFridgeGet, myFridgeDelete, myFridgePost } from "../controllers/myFridgeController";

const router = Router();

router.get("/myFridge/get", myFridgeGet);
router.delete("/myFridge/delete", myFridgeDelete);
router.post("/myFridge/post", myFridgePost);

export default router;