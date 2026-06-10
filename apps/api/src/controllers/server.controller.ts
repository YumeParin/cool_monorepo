// NOTE: Validation middle mutates req.body/query/params
// to ensure controllers receive strctly typed numbers/objects
import { Request, Response } from 'express';
import * as serverService from '@/services/server.service';
import { catchAsync } from '@/utils/catchAsync';
import {
  CreateServerInput,
  GetServerByIdInput,
  EditServerInput,
  DeleteServerInput,
} from '@/validations/server.schema';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { broadcastDeletePost, broadcastNewPost } from '@/services/websocket.service';
import * as OutputSchema from '@/types/ws';
import { success } from 'zod';

export const getServersList = catchAsync(async (req: Request, res: Response) => {
  const servers = await serverService.getServersList();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: servers,
  });
});
export const getServerById = catchAsync(async (req: Request<GetServerByIdInput>, res: Response) => {
  const server = await serverService.getServerById(req.params.discordId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: server,
  });
});
// export const getServers = catchAsync(
//   async (req: Request<{}, {}, {}, GetServerInput>, res: Response) => {
//     const { page, limit } = req.query;

//     console.log("CONTROLLER RECEIVED:", { page, limit, typePage: typeof page });

//     const posts = await postService.getPosts(page, limit);
//     console.log("Out of getPosts");
//     return res.status(HTTP_STATUS.OK).json({ success: true, data: posts });
//   },
// );

export const createServer = catchAsync(
  async (req: Request<{}, {}, CreateServerInput>, res: Response) => {
    const newServer = await serverService.createNewServer(req.body.discordId);

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: newServer,
    });
  }
);

export const updateServer = catchAsync(
  async (req: Request<{}, {}, EditServerInput>, res: Response) => {
    const { discordId, ...updateFields } = req.body;

    const updatedServer = await serverService.updateServer(discordId, updateFields);

    res.status(200).json({
      success: true,
      data: updatedServer,
    });
  }
);
// export const deletePost = catchAsync(
//   async (req: Request<DeletePostInput>, res: Response) => {
//     await postService.deletePost(req.params.id, req.userId);
//     broadcastDeletePost(req.params.id);

//     return res.status(HTTP_STATUS.NO_CONTENT).json({
//       success: true,
//       data: { message: "Post deleted successfully" },
//     });
//   },
// );
// export const adminDeletePost = catchAsync(
//   async (req: Request<DeletePostInput>, res: Response) => {
//     await postService.adminDeletePost(req.params.id, req.userId);
//     broadcastDeletePost(req.params.id);
//     return res.status(HTTP_STATUS.NO_CONTENT).json({
//       success: true,
//       data: { message: "Post deleted successfully" },
//     });
//   },
// );
