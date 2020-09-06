declare type EjsTemplateName = "forgot_password";

declare namespace Express {
  export interface Request {
    data: {
      user?: import("@prisma/client").User | null | undefined;
      refreshToken?:
        | import("../../services/RefreshToken").RefreshToken
        | undefined;
      accessToken?:
        | import("../../services/AccessToken").AccessToken
        | undefined;
    };
  }
}
