/**
 * Function to configure the environment
 */
export function configureEnvironment(
  options: {
    skipInProduction?: boolean;
  } = {}
) {
  const env = process.env.NODE_ENV;

  // Handle skipping in production
  if (options.skipInProduction && env === "production") {
    return;
  }

  // Try configuring
  try {
    const dotenv = require("dotenv");
    const path = !env || env === "production" ? `.env` : `.env.${env}`;
    dotenv.config({ path });
  } catch (e) {
    console.warn("An error occured while configuring environment", e);
  }
}

export const conf = {
  google: {
    get clientId() {
      return ENV("GOOGLE_CLIENTID");
    },
    get clientSecret() {
      return ENV("GOOGLE_CLIENTSECRET");
    },
    get applicationCredentials() {
      return ENV("GOOGLE_APPLICATION_CREDENTIALS");
    },
    get projectId() {
      return ENV("GOOGLE_PROJECTID");
    },
    storage: {
      get bucketName() {
        return ENV("GOOGLE_STORAGE_BUCKETNAME");
      },
    },
  },

  token: {
    get issuer() {
      return ENV("TOKEN_ISSUER");
    },
    get audience() {
      return ENV("TOKEN_AUDIENCE");
    },

    accessToken: {
      get secret() {
        return ENV("TOKEN_ACCESSTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV("TOKEN_ACCESSTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_ACCESSTOKEN_EXPIRESINSECONDS");
      },
    },

    refreshToken: {
      get name() {
        return ENV("TOKEN_REFRESHTOKEN_NAME");
      },
      get secret() {
        return ENV("TOKEN_REFRESHTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV("TOKEN_REFRESHTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_REFRESHTOKEN_EXPIRESINSECONDS");
      },
    },

    forgotPasswordToken: {
      get secret() {
        return ENV("TOKEN_FORGOTPASSWORDTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV("TOKEN_FORGOTPASSWORDTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_FORGOTPASSWORDTOKEN_EXPIRESINSECONDS");
      },
    },

    confirmEmailToken: {
      get secret() {
        return ENV("TOKEN_CONFIRMEMAILTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV("TOKEN_CONFIRMEMAILTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_CONFIRMEMAILTOKEN_EXPIRESINSECONDS");
      },
    },
  },

  email: {
    mailgun: {
      get apikey() {
        return ENV("EMAIL_MAILGUN_APIKEY");
      },
      get baseurl() {
        return ENV("EMAIL_MAILGUN_BASEURL");
      },
      get domain() {
        return ENV("EMAIL_MAILGUN_DOMAIN");
      },
      get host() {
        return ENV("EMAIL_MAILGUN_HOST");
      },
    },
    get defaultSender() {
      return ENV("EMAIL_DEFAULT_SENDER");
    },
    get developerEmails() {
      return ENV_ARRAY("EMAIL_DEVELOPER_EMAILS");
    },
  },

  stripe: {
    get publishableKey() {
      return ENV("STRIPE_PUBLISHABLE_KEY");
    },
    get secretKey() {
      return ENV("STRIPE_SECRET_KEY");
    },
  },

  hosts: {
    get client() {
      return ENV("HOSTS_CLIENT");
    },
    get server() {
      return ENV("HOSTS_SERVER");
    },
  },

  get port() {
    return ENV_NUM("PORT") || 8080;
  },

  get env() {
    return ENV("NODE_ENV");
  },

  get databaseUrl() {
    return ENV("DATABASE_URL");
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

function ENV_ARRAY(variable: string) {
  return (process.env[variable] || "").split(";");
}
