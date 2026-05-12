import { z } from "zod";

export type AppErrorDetails = z.core.$ZodIssue[] | Record<string, unknown>;

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public details?: AppErrorDetails;

  constructor(message: string, statusCode: number, details?: AppErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
