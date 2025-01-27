import {registerUser} from "../controllers/authController";
import {Router} from "express";

const router = Router();

router.post("/", registerUser);

export default router;