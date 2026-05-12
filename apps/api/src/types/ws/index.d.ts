import { Prisma } from "generated/prisma/client";
import { includes } from "zod";

const postWithAuthor = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    author: {
      select: { id: true, name: true, avatar: true },
    },
  },
});

export type PopulatedPost = Prisma.PostGetPayload<typeof postWithAuthor>;
