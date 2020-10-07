import * as dotenv from "dotenv";

console.log("[APP: ]", "Initializing configuration file");
console.log("[APP: ]", "Node environment:", process.env.NODE_ENV);
console.log(
  "[APP: ]",
  "Production mode",
  process.env.NODE_ENV === "production" ? "Yes" : "No"
);
console.log("[APP: ]", Object.keys(process.env).length, "items in ENV");
console.log("[APP: ]", "Hosts_client:", process.env.HOSTS_CLIENT);
console.log("[APP: ]", "Hosts_server:", process.env.HOSTS_SERVER);
if (process.env.NODE_ENV !== "production") {
  try {
    console.log("[APP: ]", "Configuring environment");
    const envPath =
      process.env.NODE_ENV === "production"
        ? `.env`
        : `.env${process.env.NODE_ENV ? "." : ""}${process.env.NODE_ENV || ""}`;
    console.log("[APP: ]", "Using path", envPath);
    dotenv.config({
      path: envPath,
    });
    console.log("[APP: ]", "Configured");
  } catch (e) {
    console.log("[APP: ]", "An error occured while configuring environment");
    console.log("[APP: ]", e);
  }
} else {
  console.log("[APP: ]", "Skipping environment configuration");
}
console.log("[APP: ]", Object.keys(process.env).length, "items in ENV");
console.log("[APP: ]", "Hosts_client:", process.env.HOSTS_CLIENT);
console.log("[APP: ]", "Hosts_server:", process.env.HOSTS_SERVER);

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

  port: ENV_NUM("PORT"),

  hosts: {
    client: ENV("HOSTS_CLIENT"),
    server: ENV("HOSTS_SERVER"),
  },
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
