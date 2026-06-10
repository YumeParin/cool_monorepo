// NOTE: Validation middle mutates req.body/query/params
// to ensure controllers receive strctly typed numbers/objects
import { Request, Response } from 'express';
import * as postService from '@/services/post.service';
import { catchAsync } from '@/utils/catchAsync';
import { GetPostsInput, CreatePostInput, DeletePostInput } from '@/validations/post.schema';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { broadcastDeletePost, broadcastNewPost } from '@/services/websocket.service';
import * as OutputSchema from '@/types/ws';

export const getPosts = catchAsync(
  async (req: Request<{}, {}, {}, GetPostsInput>, res: Response) => {
    const { page, limit } = req.query;

    console.log('CONTROLLER RECEIVED:', { page, limit, typePage: typeof page });

    const posts = await postService.getPosts(page, limit);
    console.log('Out of getPosts');
    return res.status(HTTP_STATUS.OK).json({ success: true, data: posts });
  }
);

export const createPost = catchAsync(
  async (req: Request<{}, {}, CreatePostInput>, res: Response) => {
    const newPost: OutputSchema.PopulatedPost = await postService.createNewPost(
      req.body.title,
      req.body.content,
      req.userId
    );

    broadcastNewPost(newPost);

    return res.status(HTTP_STATUS.CREATED).json({ success: true, data: newPost });
  }
);

export const deletePost = catchAsync(async (req: Request<DeletePostInput>, res: Response) => {
  await postService.deletePost(req.params.id, req.userId);
  broadcastDeletePost(req.params.id);

  return res.status(HTTP_STATUS.NO_CONTENT).json({
    success: true,
    data: { message: 'Post deleted successfully' },
  });
});
export const adminDeletePost = catchAsync(async (req: Request<DeletePostInput>, res: Response) => {
  await postService.adminDeletePost(req.params.id, req.userId);
  broadcastDeletePost(req.params.id);
  return res.status(HTTP_STATUS.NO_CONTENT).json({
    success: true,
    data: { message: 'Post deleted successfully' },
  });
});
