declare global {
  namespace Express {
    export interface Request {
      userId: string;
    }
    export interface Locals {
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
