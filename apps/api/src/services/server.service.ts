import { prisma } from '@swissokyo/db';
import { yumeid } from '@/../lib/yumeid';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { AppError } from '@/utils/AppError';
import { uuid } from 'zod';
import { uuid4 } from 'zod/v4/core/regexes.cjs';

export const getServersList = async () => {
  const servers = await prisma.server.findMany({
    take: 20,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return servers;
};
export const getServerById = async (discordId: string) => {
  const server = await prisma.server.findUnique({
    where: { discordId: discordId },
    select: {
      id: true,
      discordId: true,
      welcomeChannelId: true,
      barrierChannelId: true,
      barrierLoggingChannelId: true,
      loggingChannelId: true,
      moderatorRoleId: true,
      createdAt: true,
    },
  });

  if (!server) {
    throw new AppError('Server was not found', HTTP_STATUS.NOT_FOUND);
  }
  return server;
};
export const createNewServer = async (discordId: string) => {
  const newServer = await prisma.server.create({
    data: {
      discordId: discordId,
    },
  });
  return newServer;
};

export interface UpdateServerData {
  welcomeChannelId?: string | null;
  barrierChannelId?: string | null;
  barrierLoggingChannelId?: string | null;
  loggingChannelId?: string | null;
  moderatorRoleId?: string | null;
}
export const updateServer = async (discordId: string, dataToUpdate: UpdateServerData) => {
  try {
    const newServerData = await prisma.server.update({
      where: { discordId: discordId },
      data: dataToUpdate,
    });
    return newServerData;
  } catch (error) {
    throw new AppError('Server was not found', HTTP_STATUS.NOT_FOUND);
  }
};

// export const deletePost = async (id: string, authorId: string) => {
//   const post = await prisma.post.findUnique({ where: { id } });

//   if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);
//   if (post.authorId !== authorId)
//     throw new AppError("Unauthorized", HTTP_STATUS.FORBIDDEN);

//   await prisma.post.delete({ where: { id } });

//   return true;
// };
// export const adminDeletePost = async (id: string, authorId: string) => {
//   const post = await prisma.post.findUnique({ where: { id } });

//   if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);

//   await prisma.post.delete({ where: { id } });

//   return true;
// };
