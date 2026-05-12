import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { HTTP_STATUS } from "@/constants/httpStatus";
import { Prisma } from "@swissokyo/db/";

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let status = "error";
  let message = "Internal Server Error";
  let details = undefined;
  let stack = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
    details = err.details;
    stack = err.stack;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = HTTP_STATUS.CONFLICT;
      status = "fail";
      let fieldName = "field";

      const msg = (err.meta?.driverAdapterError as any).cause.originalMessage;

      if (msg) {
        const match = msg.match(/"\w+_(\w+)_key"/);
        if (match && match[1]) {
          fieldName = match[1];
        }
      } else if (err.meta?.target) {
        const target = err.meta?.target as string[] | string;
        const fieldName = Array.isArray(target)
          ? target.join(", ")
          : target || "field";
      }

      message = `This ${fieldName} is already taken, Please use another one.`;
    } else if (err.code === "P2025") {
      statusCode = HTTP_STATUS.NOT_FOUND;
      status = "fail";
      message = "The requested record was not found in the database.";
    } else if (err.code === "P2003") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      status = "fail";

      let fieldName: string | undefined = undefined;

      let msg = (err.meta?.driverAdapterError as any)?.cause
        ?.originalMessage as string | undefined;
      if (msg) {
        const matches = msg.match(/"([^"]+)"/g);

        if (matches && matches.length >= 2) {
          fieldName = matches[1].replace(/"/g, "");
        }
      } else if (err.meta?.field_name) {
        fieldName = String(err.meta.field_name);
      }
      const formattedField = fieldName ? ` (Relation: ${fieldName})` : "";
      message = `Cannot delete this record because it is still linked to other data${formattedField}. Please delete the linked data first.`;
    } else if (err.code === "P2000") {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      status = "fail";
      message = "The provided value is too long for the database column.";
    }
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }
  res.status(statusCode).json({
    success: false,
    status,
    message,
    details,
    ...(process.env.NODE_ENV === "development" && { stack }),
  });
};
