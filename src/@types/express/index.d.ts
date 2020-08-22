declare namespace Express {
  export interface Request {
    data: {
      user?: import("@prisma/client").User | null | undefined;
    };
  }
}
