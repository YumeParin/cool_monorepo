import { getPosts, createPost, deletePost, adminDeletePost } from '@/controllers/post.controller';

import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  createServerSchema,
  editServerSchema,
  deleteParamsSchema,
  getServerByIdSchema,
} from '../validations/server.schema';
import {
  getServersList,
  getServerById,
  createServer,
  updateServer,
} from '@/controllers/server.controller';
const router = Router();

router.get('/', getServersList);
router.get('/:discordId', validate(getServerByIdSchema), getServerById);
router.post('/', validate(createServerSchema), createServer);
router.patch('/', validate(editServerSchema), updateServer);
// router.post("/", authMiddleware, validate(createServerSchema), createServer);

// router.delete("/:id", authMiddleware, validate(deleteServerSchema), deletePost);
// router.delete(
//   "/gm/:id",
//   authMiddleware,
//   validate(deleteParamsSchema),
//   adminDeletePost,
// );
export default router;
