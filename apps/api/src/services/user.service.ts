import { prisma } from "@swissokyo/db";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { AppError } from "@/utils/AppError";
import { catchAsync } from "@/utils/catchAsync";

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  return users;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  await prisma.user.delete({ where: { id } });

  return true;
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new AppError("User was not found", HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

export const updateMe = async (userId: string, name: string) => {
  const newUserData = await prisma.user.updateMany({
    where: { id: userId },
    data: {
      name,
    },
  });
  if (!newUserData) {
    throw new AppError("User was not found", HTTP_STATUS.NOT_FOUND);
  }
  return name;
};

export const uploadAvatar = async (userId: string) => {
  const uploadAvatarData = await prisma.user.updateMany({
    where: { id: userId },
    data: {
      avatar: "https://avatarfiles.alphacoders.com/224/thumb-1920-224175.jpg",
    },
  });
  if (!uploadAvatarData) {
    throw new AppError("User was not found", HTTP_STATUS.NOT_FOUND);
  }
  return "https://avatarfiles.alphacoders.com/224/thumb-1920-224175.jpg";
};
export const beta_uploadAvatarUrl = async (
  userId: string,
  avatarUrl: string,
) => {
  const uploadAvatarData = await prisma.user.updateMany({
    where: { id: userId },
    data: {
      avatar: avatarUrl,
    },
  });
  if (!uploadAvatarData) {
    throw new AppError("User was not found", HTTP_STATUS.NOT_FOUND);
  }
  return avatarUrl;
};
