import { prisma } from "@swissokyo/db";
import { yumeid } from "@/../lib/yumeid";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { AppError } from "@/utils/AppError";
import { uuid } from "zod";
import { uuid4 } from "zod/v4/core/regexes.cjs";

export const getPosts = async () => {
  console.log("getServers");
  const servers = await prisma.server.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    // include: {
    //   members: {
    //     select: { name: true, email: true, avatar: true },
    //   },
    // },
  });
  console.log("Servers : ", servers);
  return servers;
};
//#TODO You have to finish creating the Server routes, refer to schema.prisma and ask Gemini how to use uuid for the id
export const createNewServer = async (
  discordId: string,

) => {
  const newServer = await prisma.server.create({
    data: {
      id: uuid,
      discordId: discordId
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
  return newServer;
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
