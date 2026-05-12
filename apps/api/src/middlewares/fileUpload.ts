import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { HTTP_STATUS } from "@/constants/httpStatus";

const storage = multer.memoryStorage();

const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  try {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new AppError("Only image files are allowed!", HTTP_STATUS.BAD_REQUEST),
      );
    }
  } catch (error) {
    cb(new AppError("File is invalid", HTTP_STATUS.UNAUTHORIZED));
  }
};

export const uploadAvatarMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

export const requireFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      throw new AppError(
        "No file provided. Please upload an image.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
