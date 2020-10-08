import { createLogger } from "./utils/createLogger";

const logger = createLogger({ name: "Conf" });

logger("Running environment configurations");
if (process.env.NODE_ENV !== "production") {
  logger("Environment is not production, configuring via .env file");

  try {
    const dotenv = require("dotenv");
    logger("Required dotenv");
    const envPath =
      process.env.NODE_ENV === "production"
        ? `.env`
        : `.env${process.env.NODE_ENV ? "." : ""}${process.env.NODE_ENV || ""}`;
    logger("Created env file path as", envPath);
    dotenv.config({
      path: envPath,
    });
    logger("Configured dotenv with env file");
  } catch (e) {
    console.warn("An error occured while configuring environment", e);
  }
}

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

    forgotPasswordToken: {
      secret: ENV("TOKEN_FORGOTPASSWORDTOKEN_SECRET"),
      expiresIn: ENV("TOKEN_FORGOTPASSWORDTOKEN_EXPIRESIN"),
      expiresInSeconds: ENV_NUM("TOKEN_FORGOTPASSWORDTOKEN_EXPIRESINSECONDS"),
    },

    confirmEmailToken: {
      secret: ENV("TOKEN_CONFIRMEMAILTOKEN_SECRET"),
      expiresIn: ENV("TOKEN_CONFIRMEMAILTOKEN_EXPIRESIN"),
      expiresInSeconds: ENV_NUM("TOKEN_CONFIRMEMAILTOKEN_EXPIRESINSECONDS"),
    },
  },

  email: {
    host: ENV("EMAIL_HOST"),
    port: ENV_NUM("EMAIL_PORT"),
    auth: {
      user: ENV("EMAIL_AUTH_USER"),
      pass: ENV("EMAIL_AUTH_PASS"),
    },
    defaultSender: ENV("EMAIL_DEFAULT_SENDER"),
  },

  hosts: {
    client: ENV("HOSTS_CLIENT"),
    server: ENV("HOSTS_SERVER"),
  },

  port: ENV_NUM("PORT"),

  env: ENV("NODE_ENV"),

  databaseUrl: ENV("DATABASE_URL"),
};

logger("Configured the following environment:", JSON.stringify(conf));

logger("Finished running environment configurations");

/**
 * Helper functions for fetching environment variables from process.env
 */
function ENV_NUM(variable: string) {
  return Number(process.env[variable] || "");
}

function ENV(variable: string) {
  return process.env[variable] || "";
}
