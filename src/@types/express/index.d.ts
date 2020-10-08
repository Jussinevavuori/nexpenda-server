declare type EjsTemplateName = "forgot_password";

declare namespace Express {
  export interface Request {
    data: {
      /**
       * If the user was found, their account is validated and the request
       * had valid refresh and access tokens, the user who made the request
       * can be found in this variable.
       *
       * Null means attempt was made to parse the user but failed.
       *
       * Undefined means no attempt was made to parse the user.
       */
      user?: import("@prisma/client").User | null | undefined;

      /**
       * Was an access token found in the request?
       */
      accessTokenFound?: boolean;

      /**
       * Was a refresh token found in the request?
       */
      refreshTokenFound?: boolean;

      /**
       * Was a user found with a valid access token and refresh token but
       * the user was invalid, due to being blocker or having an unverified
       * email?
       */
      blockedUser?: import("@prisma/client").User;

      /**
       * If the user is not found, save reason here
       */
      noUserReason?:
        | "disabled"
        | "email-not-verified"
        | "invalid-tokens"
        | "user-not-found";

      /**
       * The refresh token that was found in the request if valid.
       */
      refreshToken?: import("../../services/RefreshToken").RefreshToken;

      /**
       * The access token that was found in the request if valid.
       */
      accessToken?: import("../../services/AccessToken").AccessToken;
    };
  }
}
