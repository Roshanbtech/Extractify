import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/check", authenticate, AuthController.check);

export default router;
