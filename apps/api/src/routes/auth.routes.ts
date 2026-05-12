import { Router } from "express";
import { signup, login, refresh, logout } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import {
  signupBodySchema,
  loginBodySchema,
  refreshCookiesSchema,
} from "../validations/auth.schema";
const router = Router();

router.post("/signup", validate(signupBodySchema), signup);
router.post("/login", validate(loginBodySchema), login);
router.post("/refresh", validate(refreshCookiesSchema), refresh);
router.post("/logout", validate(refreshCookiesSchema), logout);

export default router;
