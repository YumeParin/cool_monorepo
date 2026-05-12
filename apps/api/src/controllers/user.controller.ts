import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@swissokyo/db";
import {
  beta_UploadAvatarUrlInput,
  DeleteUserInput,
  UpdateMeInput,
  UploadAvatarInput,
} from "@/validations/user.schema";
import { catchAsync } from "@/utils/catchAsync";
import * as userService from "@/services/user.service";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { success } from "zod";
import { AppError } from "@/utils/AppError";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.status(200).json({ success: true, data: users });
});
export const deleteUser = catchAsync(
  async (req: Request<DeleteUserInput>, res: Response) => {
    await userService.deleteUser(req.params.id);

    res.status(HTTP_STATUS.NO_CONTENT).json({ success: true, data: {} });
  },
);
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = await userService.getMe(userId);
  res.status(HTTP_STATUS.OK).json({ success: true, data: user });
});

export const updateMe = catchAsync(
  async (req: Request<{}, {}, UpdateMeInput>, res: Response) => {
    const userId = req.userId;
    const newName = req.body.name;
    const updateResult = await userService.updateMe(userId, newName);
    res.status(HTTP_STATUS.OK).json({ success: true, data: updateResult });
  },
);

export const updateAvatar = catchAsync(
  async (req: Request<{}, {}, UploadAvatarInput>, res: Response) => {
    const userId = req.userId;
    const avatarFile = req.file;
    console.log(avatarFile);
    const uploadResult = await userService.uploadAvatar(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: uploadResult });
  },
);
export const beta_updateAvatarUrl = catchAsync(
  async (req: Request<{}, {}, beta_UploadAvatarUrlInput>, res: Response) => {
    const userId = req.userId;
    const avatarUrl = req.body.avatarUrl;
    console.log(avatarUrl);
    const uploadResult = await userService.beta_uploadAvatarUrl(
      userId,
      avatarUrl,
    );
    res.status(HTTP_STATUS.OK).json({ success: true, data: uploadResult });
  },
);
