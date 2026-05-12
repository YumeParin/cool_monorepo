import { Router } from "express";
import {
  beta_updateAvatarUrl,
  deleteUser,
  getMe,
  getUsers,
  updateAvatar,
  updateMe,
} from "@/controllers/user.controller";
import { validate } from "@/middlewares/validate";
import {
  beta_uploadAvatarUrlSchema,
  deleteUserParamsSchema,
  updateMeSchema,
  uploadAvatarSchema,
} from "@/validations/user.schema";
import { authMiddleware } from "@/middlewares/auth";
import { requireFile, uploadAvatarMiddleware } from "@/middlewares/fileUpload";
const router = Router();

router.get("/list", getUsers);
router.delete("/:id", validate(deleteUserParamsSchema), deleteUser);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, validate(updateMeSchema), updateMe);
router.put(
  "/me/avatar",
  authMiddleware,
  uploadAvatarMiddleware.single("avatar"),
  requireFile,
  validate(uploadAvatarSchema),
  updateAvatar,
);
router.put(
  "/me/avatarUrl",
  authMiddleware,
  validate(beta_uploadAvatarUrlSchema),
  beta_updateAvatarUrl,
);

export default router;
