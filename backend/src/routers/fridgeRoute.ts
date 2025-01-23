import { Router } from "express";
import { myFridgeGet, myFridgeDelete, myFridgePost } from "../controllers/myFridgeController";

const router = Router();

router.get("/get", myFridgeGet);
router.delete("/delete", myFridgeDelete);
router.post("/post", myFridgePost);

export default router;