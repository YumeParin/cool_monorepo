import { getPosts, createPost, deletePost, adminDeletePost } from '@/controllers/post.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  getPostsQuerySchema,
  createPostSchema,
  deleteParamsSchema,
} from '../validations/post.schema';

const router = Router();

router.get('/', validate(getPostsQuerySchema), getPosts);
router.post('/', authMiddleware, validate(createPostSchema), createPost);
router.delete('/:id', authMiddleware, validate(deleteParamsSchema), deletePost);
router.delete('/gm/:id', authMiddleware, validate(deleteParamsSchema), adminDeletePost);
export default router;
