// import { Request, Response, NextFunction } from "express";
// import { z, ZodError, ZodType } from "zod"; //we use zod V4, AnyZodObject and ZodSchema is deprecated in it
// import { AppError } from "../utils/AppError";
// import { HTTP_STATUS } from "../constants/httpStatus";

// type RequestSchema = ZodType<{
//   body?: unknown;
//   query?: unknown;
//   params?: unknown;
// }>;

// export const validate =
//   (schema: RequestSchema) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       res.locals.validated = await schema.parseAsync({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });
//       return next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return next(
//           new AppError(
//             "Validation failed",
//             HTTP_STATUS.BAD_REQUEST,
//             error.issues,
//           ),
//         );
//       }
//       return next(error);
//     }
//   };
