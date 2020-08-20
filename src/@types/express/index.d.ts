declare namespace Express {
  export interface Request {
    user?: import("../../entity/user.entity").User | null | undefined;
  }
}
