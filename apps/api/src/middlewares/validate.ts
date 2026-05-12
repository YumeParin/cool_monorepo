import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { AppError } from "@/utils/AppError";
import { HTTP_STATUS } from "@/constants/httpStatus";
type RequestSchema = ZodType<{
  body?: unknown;
  query?: unknown;
  params?: unknown;
  cookies?: unknown;
  file?: unknown;
}>;
export const validate =
  (schema: RequestSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
        file: req.file,
      });
      req.body = validatedData.body;

      Object.defineProperty(req, "query", {
        value: validatedData.query,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(req, "params", {
        value: validatedData.params,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(req, "cookies", {
        value: validatedData.cookies,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(req, "file", {
        value: validatedData.file,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      // console.log(`query : `);
      // console.log(req.query);
      // console.log(`params : `);
      // console.log(req.params);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            `Validation Error: ${error.issues.map((i) => i.message).join(", ")}`,
            HTTP_STATUS.BAD_REQUEST,
            error.issues,
          ),
        );
      }
      return next(error);
    }
  };
