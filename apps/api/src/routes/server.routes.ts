import {
  getPosts,
  createPost,
  deletePost,
  adminDeletePost,
} from "@/controllers/post.controller";


import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import {
  createServerSchema,
  editServerSchema,
  deleteParamsSchema,
} from "../validations/server.schema";
import { getServers, createServer } from "@/controllers/server.controller";
const router = Router();

router.get("/", getServers);
router.post("/", validate(createServerSchema), createServer);
// router.post("/", authMiddleware, validate(createServerSchema), createServer);

// router.delete("/:id", authMiddleware, validate(deleteServerSchema), deletePost);
// router.delete(
//   "/gm/:id",
//   authMiddleware,
//   validate(deleteParamsSchema),
//   adminDeletePost,
// );
export default router;
