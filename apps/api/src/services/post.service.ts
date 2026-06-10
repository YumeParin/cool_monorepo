import { prisma } from '@swissokyo/db';
import { yumeid } from '@/../lib/yumeid';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { AppError } from '@/utils/AppError';

export const getPosts = async (page: number, limit: number) => {
  console.log('Getposts');
  const posts = await prisma.post.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: { name: true, email: true, avatar: true },
      },
    },
  });
  console.log('Posts : ', posts);
  return posts;
};

export const createNewPost = async (title: string, content: string, authorId: string) => {
  const newPost = await prisma.post.create({
    data: {
      id: yumeid(),
      title,
      content,
      published: true,
      author: {
        connect: { id: authorId },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  return newPost;
};

export const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);
  if (post.authorId !== authorId) throw new AppError('Unauthorized', HTTP_STATUS.FORBIDDEN);

  await prisma.post.delete({ where: { id } });

  return true;
};
export const adminDeletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND);

  await prisma.post.delete({ where: { id } });

  return true;
};
