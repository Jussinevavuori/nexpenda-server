import "dotenv/config";

export const conf = {
  google: {
    clientId: ENV("GOOGLE_CLIENTID"),
    clientSecret: ENV("GOOGLE_CLIENTSECRET"),
  },

  token: {
    issuer: ENV("TOKEN_ISSUER"),
    audience: ENV("TOKEN_AUDIENCE"),

    accessToken: {
      secret: ENV("TOKEN_ACCESSTOKEN_SECRET"),
      expiresIn: ENV("TOKEN_ACCESSTOKEN_EXPIRESIN"),
      expiresInSeconds: ENV_NUM("TOKEN_ACCESSTOKEN_EXPIRESINSECONDS"),
    },

    refreshToken: {
      name: ENV("TOKEN_REFRESHTOKEN_NAME"),
      secret: ENV("TOKEN_REFRESHTOKEN_SECRET"),
      expiresIn: ENV("TOKEN_REFRESHTOKEN_EXPIRESIN"),
      expiresInSeconds: ENV_NUM("TOKEN_REFRESHTOKEN_EXPIRESINSECONDS"),
    },
  },

  port: ENV_NUM_WITH_NODE_ENV("PORT"),

  clientHost: ENV_WITH_NODE_ENV("CLIENT_HOST"),
};

/**
 * Helper functions for fetching environment variables from process.env
 */
function ENV_NUM(variable: string) {
  return Number(process.env[variable] || "");
}

function ENV(variable: string) {
  return process.env[variable] || "";
}

function ENV_NUM_WITH_NODE_ENV(variable: string) {
  return Number(ENV_WITH_NODE_ENV(variable));
}

function ENV_WITH_NODE_ENV(variable: string) {
  const suffixMap: Record<string, string> = {
    test: "_TEST",
    development: "_DEV",
  };
  return ENV(`${variable}${suffixMap[process.env.NODE_ENV || ""] || ""}`);
}
